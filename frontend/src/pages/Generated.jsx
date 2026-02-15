import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import '../styles/global.css';

const Generated = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState(null);
  const [copiedView, setCopiedView] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);

  useEffect(() => {
    if (location.state?.formData) {
      setFormData(location.state.formData);
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'view') {
        setCopiedView(true);
        setTimeout(() => setCopiedView(false), 2000);
      } else {
        setCopiedEdit(true);
        setTimeout(() => setCopiedEdit(false), 2000);
      }
    } catch (error) {
      alert('Failed to copy link');
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Success Animation */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckIcon
            sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
          />
          <Typography variant="h3" gutterBottom fontWeight={600}>
            Form Created Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your Google Form has been generated and is ready to share
          </Typography>
        </Box>

        {/* Form Info Card */}
        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          {/* Form Header */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              pb: 3,
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: 'primary.50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={600}>
                {location.state?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Form ID: {formData.formId}
              </Typography>
            </Box>
          </Box>

          {/* Links Section */}
          <Stack spacing={3}>
            {/* Public View Link */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Public View Link
              </Typography>
              <TextField
                fullWidth
                value={formData.viewUrl}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => copyToClipboard(formData.viewUrl, 'view')}
                        edge="end"
                      >
                        {copiedView ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CopyIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => window.open(formData.viewUrl, '_blank')}
                        edge="end"
                      >
                        <OpenIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Edit Link */}
            <Box>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Edit Link (Creator Only)
              </Typography>
              <TextField
                fullWidth
                value={formData.editUrl}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => copyToClipboard(formData.editUrl, 'edit')}
                        edge="end"
                      >
                        {copiedEdit ? (
                          <CheckIcon color="success" />
                        ) : (
                          <CopyIcon />
                        )}
                      </IconButton>
                      <IconButton
                        onClick={() => window.open(formData.editUrl, '_blank')}
                        edge="end"
                      >
                        <OpenIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto' }}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<OpenIcon />}
            onClick={() => window.open(formData.viewUrl, '_blank')}
          >
            Open in Google Forms
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => navigate('/')}
          >
            Generate Another Form
          </Button>
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={() => navigate('/my-forms')}
          >
            View My Forms
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Generated;