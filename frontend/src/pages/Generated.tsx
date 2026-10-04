import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, Button, InputAdornment, TextField, IconButton, Stack, Container, Paper } from '@mui/material';
import { ContentCopy as CopyIcon, OpenInNew as OpenIcon, Description as FileIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import CloudArrowsSVG from '@/components/maritime/CloudArrowsSVG';
import type { GenerateFormResponse } from '@/types/api';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '../styles/global.css';

gsap.registerPlugin(MorphSVGPlugin);

interface LocationState {
  formData: GenerateFormResponse;
  title: string;
}

const Generated = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state: LocationState | null };
  const [formData] = useState<GenerateFormResponse | null>(
    () => location.state?.formData ?? null
  );
  const [copiedView, setCopiedView] = useState(false);
  const [copiedEdit, setCopiedEdit] = useState(false);
  const { reduceMotion } = useGSAPAnimation();

  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formData) {
      navigate('/');
    }
  }, [formData, navigate]);

  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.success-cloud', {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
      })
        .to('.arrow-down-path', {
          morphSVG: '#checkmark-small',
          duration: 0.7,
          ease: 'power2.inOut',
        })
        .to(
          flapRef.current,
          {
            rotateX: -180,
            transformOrigin: 'top',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '<'
        )
        .to(
          sealRef.current,
          {
            scale: 1.3,
            opacity: 0,
            duration: 0.3,
            ease: 'power1.in',
          },
          '<'
        )
        .from(
          letterRef.current,
          {
            y: 100,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
          },
          '>'
        )
        .from(
          '.link-row',
          {
            y: 20,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            ease: 'power2.out',
          },
          '<'
        );
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  const copyToClipboard = async (text: string, type: 'view' | 'edit') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'view') {
        setCopiedView(true);
        setTimeout(() => setCopiedView(false), 2000);
      } else {
        setCopiedEdit(true);
        setTimeout(() => setCopiedEdit(false), 2000);
      }
    } catch {
      alert('Failed to copy link');
    }
  };

  if (!formData) {
    return null;
  }

  return (
    <div className="page-maritime">
      <Container maxWidth="md" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
        {/* Success Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <div className="success-medallion">
            <CloudArrowsSVG size={56} animate={false} />
          </div>

          <Typography variant="h3" gutterBottom fontWeight={600}>
            Form Created Successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your Google Form has been generated and is ready to share
          </Typography>
        </Box>

        {/* Envelope Section */}
        <div className="envelope" ref={envelopeRef}>
          <div className="envelope-body">
            <div className="envelope-flap" ref={flapRef} />
            <div className="wax-seal" ref={sealRef} />
            <div className="letter-inside" ref={letterRef}>
              <Paper sx={{ p: 4 }}>
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
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
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
                                <CheckCircleIcon color="success" />
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
                  <Box className="link-row">
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight={600}
                    >
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
                                <CheckCircleIcon color="success" />
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
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <Stack spacing={2} sx={{ maxWidth: 500, mx: 'auto', mt: 4 }}>
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
    </div>
  );
};

export default Generated;