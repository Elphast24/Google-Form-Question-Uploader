const express = require('express');
const { oauth2Client, SCOPES } = require('../config/google');
const { db } = require('../config/firebase');
const authenticateUser = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
router.get('/google', authenticateUser, (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    state: req.user.uid, // Pass user ID to verify later
    prompt: 'consent' // Force consent screen to get refresh token
  });
  
  res.json({ authUrl });
});

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code) {
    return res.status(400).send('Authorization code missing');
  }

  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Store tokens in Firestore for the user
    const userRef = db.collection('users').doc(state); // state contains uid
    await userRef.update({
      googleTokens: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      },
      googleConnected: true,
      updatedAt: new Date()
    });

    console.log(`✅ Google tokens stored for user: ${state}`);
    
    // Redirect to frontend success page
    res.redirect(`${process.env.FRONTEND_URL}/oauth-success`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/oauth-error`);
  }
});

/**
 * GET /api/auth/google/status
 * Check if user has connected Google account
 */
router.get('/google/status', authenticateUser, async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const doc = await userRef.get();
    const userData = doc.data();
    
    res.json({
      connected: !!userData?.googleConnected,
      hasTokens: !!(userData?.googleTokens?.access_token)
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check Google connection status' });
  }
}); 

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/google/callback', async (req, res) => {
    const { code, state, error } = req.query;
    
    if (error) {
      console.error('OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent(error)}`);
    }
  
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?error=${encodeURIComponent('Authorization code missing')}`);
    }
  
    try {
      // Exchange authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      
      // Store tokens in Firestore for the user
      const userId = state; // state contains the Firebase UID
      const userRef = db.collection('users').doc(userId);
      
      await userRef.update({
        googleTokens: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expiry_date: tokens.expiry_date,
          scope: tokens.scope,
          token_type: tokens.token_type
        },
        googleConnected: true,
        googleConnectedAt: new Date(),
        updatedAt: new Date()
      });
  
      console.log(`✅ Google OAuth tokens stored for user: ${userId}`);
      
      // Get the user's Firebase token to send back
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      
      // Generate a custom token or use existing Firebase token
      // For simplicity, we'll redirect with success
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?success=true`);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?error=${encodeURIComponent('Authentication failed')}`);
    }
  });

module.exports = router;