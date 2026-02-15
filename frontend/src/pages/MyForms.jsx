import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ContentCopy as CopyIcon,
  OpenInNew as OpenIcon,
  Description as FileIcon,
  CalendarToday as CalendarIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import LoadingScreen from '../components/Loader';
import { getUserForms } from '../services/api';
import '../styles/global.css';

const MyForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchForms();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = forms.filter((form) =>
        form.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredForms(filtered);
    } else {
      setFilteredForms(forms);
    }
  }, [searchQuery, forms]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await getUserForms();
      setForms(response.forms || []);
      setFilteredForms(response.forms || []);
    } catch (error) {
      setError(error.message || 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert('Failed to copy link');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingScreen text="Loading your forms..." />;
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 200px)' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              My Forms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all your generated Google Forms
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/')}
          >
            Create New Form
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar */}
        {forms.length > 0 && (
          <TextField
            fullWidth
            placeholder="Search forms by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 4, maxWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}

        {/* Forms Grid */}
        {filteredForms.length > 0 ? (
          <Grid container spacing={3}>
            {filteredForms.map((form) => (
              <Grid item xs={12} sm={6} md={4} key={form.id}>
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    {/* Card Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: 'primary.50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FileIcon sx={{ color: 'primary.main' }} />
                      </Box>
                      <Chip
                        icon={<CalendarIcon sx={{ fontSize: 14 }} />}
                        label={formatDate(form.createdAt)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    {/* Form Title */}
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {form.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {form.formId}
                    </Typography>

                    {/* Links */}
                    <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          View Link
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() =>
                              copyToClipboard(form.viewUrl, `view-${form.id}`)
                            }
                          >
                            {copiedId === `view-${form.id}` ? (
                              <FileIcon color="success" fontSize="small" />
                            ) : (
                              <CopyIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => window.open(form.viewUrl, '_blank')}
                          >
                            <OpenIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Edit Link
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() =>
                              copyToClipboard(form.editUrl, `edit-${form.id}`)
                            }
                          >
                            {copiedId === `edit-${form.id}` ? (
                              <FileIcon color="success" fontSize="small" />
                            ) : (
                              <CopyIcon fontSize="small" />
                            )}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => window.open(form.editUrl, '_blank')}
                          >
                            <OpenIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <FileIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              {searchQuery ? 'No forms found' : 'No forms yet'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Create your first Google Form by uploading a document'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/')}
              >
                Create Your First Form
              </Button>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyForms;