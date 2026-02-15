// config/firebase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
// Initialize Firebase Admin SDK
// const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };