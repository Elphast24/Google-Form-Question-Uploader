// middleware/auth.js
const { admin, db } = require('../config/firebase');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // 🔹 AUTO-CREATE FIRESTORE USER IF MISSING
    const userRef = db.collection('users').doc(decodedToken.uid);
    const doc = await userRef.get();
    if (!doc.exists) {
      await userRef.set({
        email: decodedToken.email || '',
        name: decodedToken.name || '',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Created Firestore user for UID: ${decodedToken.uid}`);
    }

    // Attach user data to request
    req.user = {
      uid: decodedToken.uid,
      ...(doc.exists ? doc.data() : { email: decodedToken.email, name: decodedToken.name })
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = authenticateUser;
