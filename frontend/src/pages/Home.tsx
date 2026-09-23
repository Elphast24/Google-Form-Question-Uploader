import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UploadBox from '@/components/UploadBox';
import Loader from '@/components/Loader';
import { uploadFile } from '@/services/api';
import type { UploadResponse } from '@/types/api';
import { FileText, Sparkles, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate } from 'animejs';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import '@/styles/global.css';

gsap.registerPlugin(ScrollTrigger);

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  picture: string | null;
}

const Home: React.FC = () => {
  const { user, signIn } = useAuth() as {
    user: User | null;
    signIn: () => Promise<void>;
  };
  const navigate = useNavigate();
  const [file, setFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { reduceMotion } = useGSAPAnimation();

  const heroRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);

  /* GSAP ScrollTrigger animations on each section */
  useEffect(() => {
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current.querySelectorAll('.home-hero-content > *'), {
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.6,
          ease: 'power2.out',
        });
      }

      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card');
        cards.forEach((card) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 30,
            duration: 0.5,
            ease: 'power2.out',
          });
        });
      }

      if (uploadSectionRef.current) {
        const el = uploadSectionRef.current;
        gsap.from(
          el.querySelectorAll('.upload-box, .button-primary, .button-secondary'),
          {
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.5,
            ease: 'power2.out',
          }
        );
      }
    });

    return () => ctx.revert();
  }, [reduceMotion]);

  /* Anime.js subtle pulse on hero title */
  useEffect(() => {
    if (reduceMotion) return;

    const titleEl = document.querySelector('.home-title');
    if (!titleEl) return;

    animate(titleEl, {
      scale: [1, 1.02, 1],
      duration: 6000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
  }, [reduceMotion]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleGenerateForm = async () => {
    if (!user) {
      try {
        await signIn();
      } catch {
        setError('Please sign in to continue');
        return;
      }
    }

    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response: UploadResponse = await uploadFile(file);

      navigate('/preview', {
        state: {
          questions: response.questions,
          fileName: file.name,
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="home-page">
        <section className="home-hero" ref={heroRef}>
          <div className="home-hero-content">
            <h1 className="home-title">
              Transform Documents into
              <span className="gradient-text"> Google Forms</span>
            </h1>
            <p className="home-subtitle">
              Upload your DOCX or TXT file and let AI extract questions automatically.
              Generate professional Google Forms in seconds.
            </p>
          </div>

          <div className="home-features" ref={featuresRef}>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#E8F0FE' }}>
                <Sparkles size={24} color="#4285F4" />
              </div>
              <h3>AI-Powered</h3>
              <p>Gemini AI intelligently extracts questions from your documents</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#FEE8E7' }}>
                <Zap size={24} color="#DB4437" />
              </div>
              <h3>Lightning Fast</h3>
              <p>Generate forms in seconds, not hours</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ background: '#E6F4EA' }}>
                <FileText size={24} color="#0F9D58" />
              </div>
              <h3>Multiple Formats</h3>
              <p>Support for DOCX and TXT file formats</p>
            </div>
          </div>
        </section>

        <section className="home-upload-section" ref={uploadSectionRef}>
          <UploadBox onFileSelect={handleFileSelect} disabled={uploading} />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            onClick={handleGenerateForm}
            disabled={!file || uploading}
            className="button-primary button-large"
          >
            {uploading ? (
              <>
                <Loader text="" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Form
              </>
            )}
          </button>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="footer-text">
              © {new Date().getFullYear()} AI Form Generator. Powered by Gemini AI &amp; Google Forms API.
            </p>
            <div className="footer-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                GitHub
              </a>
              <span className="footer-divider">•</span>
              <a href="https://docs.google.com/forms" target="_blank" rel="noopener noreferrer" className="footer-link">
                Google Forms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
