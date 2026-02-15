const { oauth2Client, SCOPES } = require('../config/googleAuth');
const { db, admin } = require('../config/firebase');
const { google } = require('googleapis');

/**
 * Initiate Google OAuth2 flow
 */
const initiateGoogleAuth = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });

  res.json({ authUrl });
};

/**
 * Handle Google OAuth2 callback
 */
const handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code not provided' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Create or update user in Firebase Auth
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().getUserByEmail(data.email);
    } catch (error) {
      // Create new user if doesn't exist
      firebaseUser = await admin.auth().createUser({
        email: data.email,
        displayName: data.name,
        photoURL: data.picture
      });
    }

    // Store user credentials in Firestore
    await db.collection('users').doc(firebaseUser.uid).set({
      name: data.name,
      email: data.email,
      googleId: data.id,
      picture: data.picture,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Create custom Firebase token
    const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${customToken}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

/**
 * Verify Firebase token
 */
const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token not provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();

    res.json({
      uid: decodedToken.uid,
      name: userData.name,
      email: userData.email,
      picture: userData.picture
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  initiateGoogleAuth,
  handleGoogleCallback,
  verifyToken
};