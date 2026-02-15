import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate('/preview', { replace: true });
    }, 2000);
  }, [navigate]);

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h5">Google Account Connected!</Typography>
      <Typography color="text.secondary">Redirecting...</Typography>
    </Box>
  );
};

export default OAuthSuccess;