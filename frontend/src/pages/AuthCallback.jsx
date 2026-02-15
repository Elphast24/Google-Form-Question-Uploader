import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import '../styles/global.css';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Connecting your Google account...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(decodeURIComponent(error));
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (success === 'true') {
          setStatus('success');
          setMessage('Google account connected successfully!');
          
          // Get redirect location (where user came from before OAuth)
          const redirectTo = localStorage.getItem('oauth_redirect') || '/preview';
          localStorage.removeItem('oauth_redirect');
          
          console.log('✅ OAuth successful, redirecting to:', redirectTo);
          
          // Redirect after showing success message
          setTimeout(() => {
            navigate(redirectTo, { 
              state: { googleConnected: true },
              replace: true 
            });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Invalid callback parameters');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage(err.message || 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <Box sx={{ 
      bgcolor: 'background.default',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container maxWidth="sm">
        <Box sx={{ 
          textAlign: 'center',
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3
        }}>
          {status === 'processing' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" gutterBottom>
                Connecting Google Account
              </Typography>
              <Typography color="text.secondary">
                {message}
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircleIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'success.main',
                  mb: 2 
                }} 
              />
              <Typography variant="h5" gutterBottom color="success.main">
                Success!
              </Typography>
              <Typography color="text.secondary">
                {message}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Redirecting...
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <ErrorIcon 
                sx={{ 
                  fontSize: 80, 
                  color: 'error.main',
                  mb: 2 
                }} 
              />
              <Typography variant="h5" gutterBottom color="error.main">
                Connection Failed
              </Typography>
              <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="body2" color="text.secondary">
                Redirecting to home...
              </Typography>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default AuthCallback;