import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '../styles/global.css';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const stampRef = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useGSAPAnimation();

  useEffect(() => {
    if (!reduceMotion && stampRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(stampRef.current, {
          scale: 3,
          rotateZ: -25,
          opacity: 0,
          duration: 0.4,
          ease: 'power4.out',
          onComplete: () => {
            gsap.to('.page-maritime', {
              x: 4,
              duration: 0.05,
              repeat: 6,
              yoyo: true,
            });
          },
        });
      });

      return () => ctx.revert();
    }
  }, [reduceMotion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/preview', { replace: true });
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="page-maritime">
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
        }}
      >
        <div ref={stampRef} className="oauth-card">
          <div className="check-icon">
            &#10003;
          </div>
          <h2>Google Account Connected!</h2>
          <p>Redirecting to your preview...</p>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;