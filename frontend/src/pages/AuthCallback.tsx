import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '../styles/global.css';

gsap.registerPlugin(MorphSVGPlugin);

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Connecting your Google account...');
  const { reduceMotion } = useGSAPAnimation();
  const leftCloudRef = useRef<SVGSVGElement>(null);
  const rightCloudRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!reduceMotion && leftCloudRef.current && rightCloudRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        tl.from(leftCloudRef.current, {
          x: -200,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
        })
          .from(
            rightCloudRef.current,
            {
              x: 200,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
            },
            '<'
          )
          .to(
            [leftCloudRef.current, rightCloudRef.current],
            {
              x: 0,
              duration: 0.6,
              ease: 'power2.inOut',
            },
            '>'
          )
          .to(
            '.auth-cloud-wrap .arrow-up',
            {
              morphSVG: '#checkmark-small',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            '<'
          )
          .to(
            '.auth-cloud-wrap .arrow-down',
            {
              morphSVG: '#checkmark-small',
              duration: 0.8,
              ease: 'power2.inOut',
            },
            '<'
          );
      });

      return () => ctx.revert();
    }
  }, [reduceMotion]);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const success = searchParams.get('success');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setStatus('error');
          setMessage(decodeURIComponent(errorParam));
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (success === 'true') {
          setStatus('success');
          setMessage('Google account connected successfully!');

          const redirectTo = localStorage.getItem('oauth_redirect') || '/preview';
          localStorage.removeItem('oauth_redirect');

          setTimeout(() => {
            navigate(redirectTo, {
              state: { googleConnected: true },
              replace: true,
            });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Invalid callback parameters');
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        console.error('OAuth callback error:', err);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="page-maritime">
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: 'center',
              p: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {status === 'processing' && (
              <>
                <div className="auth-cloud-wrap">
                  <svg
                    ref={leftCloudRef}
                    className="cloud-small"
                    viewBox="0 0 160 120"
                  >
                    <defs>
                      <linearGradient id="orange-grad-a" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F5C978" />
                        <stop offset="100%" stopColor="#D97F1E" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M30,60 C25,48 35,32 50,34 C55,22 70,22 85,34 C92,32 98,38 98,46 C98,58 88,64 78,64 L42,64 C36,64 30,60 30,60 Z"
                      fill="url(#orange-grad-a)"
                      opacity="0.7"
                    />
                  </svg>
                  <svg
                    ref={rightCloudRef}
                    className="cloud-small"
                    viewBox="0 0 160 120"
                  >
                    <path
                      d="M130,60 C125,48 135,32 150,34 C155,22 170,22 185,34 C192,32 198,38 198,46 C198,58 188,64 178,64 L142,64 C136,64 130,60 130,60 Z"
                      fill="url(#orange-grad-a)"
                      opacity="0.7"
                    />
                  </svg>
                </div>

                <div className="auth-cloud-wrap">
                  <svg
                    className="arrow-up"
                    viewBox="0 0 160 120"
                  >
                    <path
                      d="M60,55 L80,75 L100,55"
                      fill="none"
                      stroke="url(#orange-grad-a)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <svg
                    className="arrow-down"
                    viewBox="0 0 160 120"
                  >
                    <path
                      d="M100,75 L80,55 L60,75"
                      fill="none"
                      stroke="url(#orange-grad-a)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

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
                <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="success.main">
                  Success!
                </Typography>
                <Typography color="text.secondary">{message}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Redirecting...
                </Typography>
              </>
            )}

            {status === 'error' && (
              <>
                <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom color="error.main">
                  Connection Failed
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography color="text.secondary">{message}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Redirecting to home...
                </Typography>
              </>
            )}
          </Box>
        </Container>
      </Box>
    </div>
  );
};

export default AuthCallback;