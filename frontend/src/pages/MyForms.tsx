import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, TextField, InputAdornment, Card, CardContent, IconButton, Chip, Alert } from '@mui/material';
import { Search as SearchIcon, ContentCopy as CopyIcon, OpenInNew as OpenIcon, Description as FileIcon, CalendarToday as CalendarIcon, Add as AddIcon } from '@mui/icons-material';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from '@/components/Loader';
import { getUserForms } from '@/services/api';
import type { UserForm } from '@/types/api';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '../styles/global.css';

gsap.registerPlugin(ScrollTrigger);

const MyForms = () => {
  const navigate = useNavigate();
  const [forms, setForms] = useState<UserForm[]>([]);
  const [filteredForms, setFilteredForms] = useState<UserForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { reduceMotion } = useGSAPAnimation();

  const gridRef = useRef<HTMLDivElement>(null);

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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load forms'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.folder-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert('Failed to copy link');
    }
  };

  const formatDate = (date: string) => {
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
    <div className="page-maritime">
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h3" gutterBottom fontWeight={600}>
              My Forms
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage all your generated Google Forms
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/')}>
            Create New Form
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Search Bar with brass frame */}
        {forms.length > 0 && (
          <div className="brass-search">
            <SearchIcon className="search-icon-brass" />
            <TextField
              fullWidth
              placeholder="Search forms by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        )}

        {/* Filing Cabinet Grid */}
        {filteredForms.length > 0 ? (
          <div className="cabinet-grid" ref={gridRef}>
            {filteredForms.map((form) => (
              <Box
                key={form.id}
                sx={{ flex: '1 1 calc(33.333% - 24px)', minWidth: '280px' }}
              >
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'transparent',
                    boxShadow: 'none',
                  }}
                >
                  <CardContent
                    className="folder-card"
                    sx={{ flex: 1, p: 3 }}
                  >
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

                    <Box className="folder-links" sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Box className="folder-link-row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          View Link
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(form.viewUrl, `view-${form.id}`)}
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

                      <Box className="folder-link-row" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Edit Link
                        </Typography>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(form.editUrl, `edit-${form.id}`)}
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
              </Box>
            ))}
          </div>
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
    </div>
  );
};

export default MyForms;