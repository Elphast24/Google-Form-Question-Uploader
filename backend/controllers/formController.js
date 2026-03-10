const googleFormsService = require('../services/googleFormsService');
const { db, admin } = require('../config/firebase');
const { oauth2Client } = require('../config/googleAuth');

/**
 * Save draft form (before creating Google Form)
 */
const saveDraft = async (req, res, next) => {
  try {
    const { title, questions, draftId } = req.body;
    const userId = req.user.uid;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid request. Title and questions are required.' });
    }

    const draftData = {
      userId: userId,
      title: title,
      questions: questions,
      questionCount: questions.length,
      status: 'draft',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    let draftRef;
    
    if (draftId) {
      // Update existing draft
      draftRef = db.collection('drafts').doc(draftId);
      await draftRef.update(draftData);
      console.log(`✅ Draft updated: ${draftId}`);
    } else {
      // Create new draft
      draftData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      draftRef = await db.collection('drafts').add(draftData);
      console.log(`✅ Draft created: ${draftRef.id}`);
    }

    res.json({
      success: true,
      draftId: draftId || draftRef.id,
      message: draftId ? 'Draft updated successfully' : 'Draft saved successfully'
    });
  } catch (error) {
    console.error('❌ Save draft error:', error);
    next(error);
  }
};

/**
 * Get all drafts for authenticated user
 */
const getUserDrafts = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const draftsSnapshot = await db.collection('drafts')
      .where('userId', '==', userId)
      .orderBy('updatedAt', 'desc')
      .get();

    const drafts = [];
    draftsSnapshot.forEach(doc => {
      const data = doc.data();
      drafts.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    res.json({
      success: true,
      drafts: drafts,
      count: drafts.length
    });
  } catch (error) {
    console.error('❌ Get drafts error:', error);
    next(error);
  }
};

/**
 * Get single draft by ID
 */
const getDraftById = async (req, res, next) => {
  try {
    const { draftId } = req.params;
    const userId = req.user.uid;

    const draftDoc = await db.collection('drafts').doc(draftId).get();

    if (!draftDoc.exists) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const draftData = draftDoc.data();

    // Check if user owns this draft
    if (draftData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      draft: {
        id: draftDoc.id,
        ...draftData,
        createdAt: draftData.createdAt?.toDate(),
        updatedAt: draftData.updatedAt?.toDate()
      }
    });
  } catch (error) {
    console.error('❌ Get draft error:', error);
    next(error);
  }
};

/**
 * Delete draft
 */
const deleteDraft = async (req, res, next) => {
  try {
    const { draftId } = req.params;
    const userId = req.user.uid;

    const draftDoc = await db.collection('drafts').doc(draftId).get();

    if (!draftDoc.exists) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const draftData = draftDoc.data();

    if (draftData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db.collection('drafts').doc(draftId).delete();
    console.log(`✅ Draft deleted: ${draftId}`);

    res.json({
      success: true,
      message: 'Draft deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete draft error:', error);
    next(error);
  }
};

/**
 * Generate Google Form from draft or direct submission
 */
const generateForm = async (req, res, next) => {
  try {
    const { title, questions, draftId } = req.body;
    const userId = req.user.uid;

    if (!title || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Invalid request. Title and questions are required.' });
    }

    // Get user's Google tokens from Firestore
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    // Check if user has Google OAuth tokens
    if (!userData?.googleTokens || !userData.googleTokens.access_token) {
      return res.status(401).json({ 
        error: 'Google authentication required',
        requiresAuth: true 
      });
    }

    // Set OAuth credentials
    oauth2Client.setCredentials(userData.googleTokens);

    // Check if token is expired and refresh if needed
    if (userData.googleTokens.expiry_date && userData.googleTokens.expiry_date < Date.now()) {
      console.log('🔄 Refreshing expired Google token...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        
        await userRef.update({
          'googleTokens.access_token': credentials.access_token,
          'googleTokens.expiry_date': credentials.expiry_date,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        oauth2Client.setCredentials(credentials);
        console.log('✅ Token refreshed successfully');
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        return res.status(401).json({ 
          error: 'Google authentication expired. Please reconnect your account.',
          requiresAuth: true 
        });
      }
    }

    // Generate Google Form with authenticated client
    const formData = await googleFormsService.createForm(
      title,
      questions,
      oauth2Client
    );

    // Store form metadata in Firestore
    const formRef = await db.collection('forms').add({
      userId: userId,
      title: title,
      formId: formData.formId,
      viewUrl: formData.viewUrl,
      editUrl: formData.editUrl,
      questionCount: questions.length,
      questions: questions,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'published',
      draftId: draftId || null // Reference to draft if created from draft
    });

    // If created from draft, optionally delete the draft
    if (draftId) {
      await db.collection('drafts').doc(draftId).delete();
      console.log(`✅ Draft ${draftId} deleted after form creation`);
    }

    console.log(`✅ Form created successfully: ${formData.formId}`);
    console.log(`✅ Saved to Firestore with ID: ${formRef.id}`);

    res.json({
      success: true,
      formId: formData.formId,
      viewUrl: formData.viewUrl,
      editUrl: formData.editUrl,
      firestoreId: formRef.id,
      questionCount: questions.length
    });
  } catch (error) {
    console.error('❌ Form generation error:', error);
    
    if (error.message?.includes('insufficient authentication scopes')) {
      return res.status(401).json({ 
        error: 'Insufficient permissions. Please reconnect your Google account.',
        requiresAuth: true 
      });
    }
    
    if (error.message?.includes('invalid_grant')) {
      return res.status(401).json({ 
        error: 'Google authentication expired. Please reconnect your account.',
        requiresAuth: true 
      });
    }
    
    next(error);
  }
};

/**
 * Get all forms for authenticated user
 */
const getUserForms = async (req, res, next) => {
  try {
    const userId = req.user.uid;

    const formsSnapshot = await db.collection('forms')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    const forms = [];
    formsSnapshot.forEach(doc => {
      const data = doc.data();
      forms.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate()
      });
    });

    res.json({
      success: true,
      forms: forms,
      count: forms.length
    });
  } catch (error) {
    console.error('❌ Get user forms error:', error);
    next(error);
  }
};

module.exports = {
  saveDraft,
  getUserDrafts,
  getDraftById,
  deleteDraft,
  generateForm,
  getUserForms
};