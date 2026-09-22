import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger, MorphSVGPlugin, SplitText } from 'gsap/all';
import {
  Upload,
  Brain,
  Edit3,
  Send,
  FolderOpen,
  ArrowRight,
  Sparkles,
  FileText,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import UploadBox from '@/components/UploadBox';
import WorkflowCard from '@/components/WorkflowCard';
import PillButton from '@/components/maritime/PillButton';
import Eyebrow from '@/components/maritime/Eyebrow';
import AssetShowcase from '@/components/maritime/AssetShowcase';
import rocket from '@/assets/3d/Cartoon_Rocket_Launch.png';
import cloud from '@/assets/cloud.png';
import '@/styles/global.css';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, SplitText);

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  picture: string | null;
}

/* ---------------- DATA ---------------- */

const HERO_STATS = [
  { label: 'Google Forms' },
  { label: 'Gemini' },
  { label: 'Google OAuth' },
];

const WORKFLOW = [
  { step: '01', title: 'Upload Docs', desc: 'Drop DOCX, TXT, or PDF', icon: Upload },
  { step: '02', title: 'AI Parsing', desc: 'Gemini extracts structure', icon: Brain },
  { step: '03', title: 'Edit & Preview', desc: 'Fine-tune every field', icon: Edit3 },
  { step: '04', title: 'Publish', desc: 'Push to Google Forms', icon: Send },
  { step: '05', title: 'Manage', desc: 'Track and reuse', icon: FolderOpen },
];

const TEMPLATES = [
  {
    title: 'Survey',
    subtitle: 'Customer Feedback',
    tag: 'Popular',
    gradient: 'linear-gradient(135deg, #E8F0FA 0%, #B8D4F0 100%)',
  },
  {
    title: 'Feedback',
    subtitle: 'Product Research',
    tag: 'New',
    gradient: 'linear-gradient(135deg, #FEE8E0 0%, #FFB8A0 100%)',
  },
  {
    title: 'Quiz',
    subtitle: 'Assessment',
    tag: 'Trending',
    gradient: 'linear-gradient(135deg, #E6F4EA 0%, #A8D8B9 100%)',
  },
];

const FEATURES = [
  { icon: FileText, label: 'DOCX & TXT parsing' },
  { icon: Brain, label: 'Auto question typing' },
  { icon: Zap, label: 'Type detection' },
  { icon: CheckCircle2, label: 'Draft auto-saving' },
  { icon: Sparkles, label: 'Smart grouping' },
];

/* ---------------- COMPONENT ---------------- */

const Home = () => {
  const { user, signIn } = useAuth() as {
    user: User | null;
    signIn: () => Promise<void>;
  };
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { reduceMotion } = useGSAPAnimation();

  const heroRef = useRef<HTMLElement>(null);
  const workflowRef = useRef<HTMLElement>(null);
  const splitRef = useRef<HTMLElement>(null);

  useEffect(() => {
   if (reduceMotion) return;

const ctx = gsap.context(() => {
  // Initialize SplitTexts
  const splitT1 = SplitText.create('#hero-text-1', { type: 'words,lines', linesClass: 'line', autoSplit: true });
  const splitT2 = SplitText.create('#hero-text-2', { type: 'words,lines', linesClass: 'line', autoSplit: true });
  const splitL1 = SplitText.create('#hero-lede-1', { type: 'words,lines', linesClass: 'line', autoSplit: true });
  const splitL2 = SplitText.create('#hero-lede-2', { type: 'words,lines', linesClass: 'line', autoSplit: true });

  // Initial layout clean up
  gsap.set('#cycle-2', { opacity: 0, pointerEvents: 'none' });
  gsap.set('#cycle-1', { opacity: 1, pointerEvents: 'auto' });

  // Timeline matching the switcher layout perfectly
  const mainCycleTl = gsap.timeline({ repeat: -1 });

  mainCycleTl
    // Phase 1: Cycle 1 In
    .from('#hero-text-1 .line', { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power4.out' })
    .from('#hero-lede-1 .line', { yPercent: 60, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .to({}, { duration: 3.5 }) // Hold
    
    // Phase 2: Cycle 1 Out, Cycle 2 In
    .to('#hero-text-1 .line', { yPercent: -100, opacity: 0, stagger: 0.03, duration: 0.4, ease: 'power4.in' })
    .to('#hero-lede-1 .line', { yPercent: -60, opacity: 0, stagger: 0.02, duration: 0.3, ease: 'power3.in' }, '-=0.3')
    .to('#cycle-1', { opacity: 0, pointerEvents: 'none', duration: 0.2 })
    .set('#cycle-2', { opacity: 1, pointerEvents: 'auto' })
    
    .from('#hero-text-2 .line', { yPercent: 100, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power4.out' })
    .from('#hero-lede-2 .line', { yPercent: 60, opacity: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .to({}, { duration: 3.5 }) // Hold

    // Phase 3: Cycle 2 Out, reset back to Cycle 1
    .to('#hero-text-2 .line', { yPercent: -100, opacity: 0, stagger: 0.03, duration: 0.4, ease: 'power4.in' })
    .to('#hero-lede-2 .line', { yPercent: -60, opacity: 0, stagger: 0.02, duration: 0.3, ease: 'power3.in' }, '-=0.3')
    .to('#cycle-2', { opacity: 0, pointerEvents: 'none', duration: 0.2 })
    .set('#cycle-1', { opacity: 1, pointerEvents: 'auto' });

  // Floating animation for the 3D image (lightweight)
  gsap.from('.hero-3d-frame', { opacity: 0, scale: 0.9, duration: 1.2, ease: 'power4.out' });
  gsap.from('.hero-interactive-card', { opacity: 0, y: 40, duration: 1, ease: 'back.out(1.2)', delay: 0.4 });
  
  gsap.to('.hero-3d-img', { y: -12, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', willChange: 'transform' });
});
return () => ctx.revert();
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
      const response = await import('@/services/api').then((m) =>
        m.uploadFile(file)
      );

      navigate('/preview', {
        state: {
          questions: response.questions,
          fileName: file.name,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to process file. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getStatIcon = (label: string) => {
    switch (label) {
      case 'Google Forms':
        return (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="2" width="22" height="24" rx="3" fill="#4285F4"/>
            <rect x="7" y="6" width="14" height="2" rx="1" fill="white"/>
            <rect x="7" y="11" width="10" height="2" rx="1" fill="white" opacity="0.7"/>
            <rect x="7" y="16" width="14" height="2" rx="1" fill="white" opacity="0.7"/>
            <rect x="7" y="21" width="8" height="2" rx="1" fill="white" opacity="0.5"/>
          </svg>
        );
      case 'Gemini':
        return (
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/055/687/065/small_2x/gemini-google-icon-symbol-logo-free-png.png"
            alt="Gemini"
            width="28"
            height="28"
            style={{ borderRadius: '50%' }}
          />
        );
      case 'Google OAuth':
        return (
          <img
            src="https://icon2.cleanpng.com/lnd/20241121/sc/bd7ce03eb1225083f951fc01171835.webp"
            alt="Google OAuth"
            width="28"
            height="28"
            style={{ borderRadius: '50%' }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="page-maritime">
      {/* ==================== 1. HERO ==================== */}
<section className="hero-modern" ref={heroRef}>
  {/* Ambient glowing mesh elements */}
  <div className="hero-mesh-glow hero-mesh-glow--coral" aria-hidden="true" />
  <div className="hero-mesh-glow hero-mesh-glow--navy" aria-hidden="true" />

  <div className="hero-modern-container">
    {/* Left Column: Premium Value Proposition & Text Switcher */}
    <div className="hero-modern-copy">
      <div className="hero-badge">
        <Sparkles size={14} className="sparkle-icon" />
        <span>Gemini 1.5 Pro Active Engine</span>
      </div>

      {/* Stable container containing our text cycles */}
      <div className="hero-title-switcher-container">
        {/* Cycle 1 */}
        <div className="hero-text-cycle" id="cycle-1">
          <h1 className="hero-title-split" id="hero-text-1">
            Smart Forms, <br />
            <span className="text-gradient-coral">Powered by AI</span>
          </h1>
          <p className="hero-lede-split" id="hero-lede-1">
            Upload static documents and instantly generate intelligent, interactive Google Forms. No more manual copy-pasting.
          </p>
        </div>

        {/* Cycle 2 */}
        <div className="hero-text-cycle" id="cycle-2">
          <h1 className="hero-title-split" id="hero-text-2">
            Upload Once, <br />
            <span className="text-gradient-navy">Publish Anywhere</span>
          </h1>
          <p className="hero-lede-split" id="hero-lede-2">
            Convert DOCX, TXT, or PDF tables into production-ready question configurations mapped directly to API fields.
          </p>
        </div>
      </div>

      {/* Action triggers layout independent of switcher transitions */}
      <div className="hero-cta-group">
        <PillButton
          variant="coral"
          onClick={() => handleScrollTo('split-cta')}
        >
          Get Started Free
        </PillButton>
        <button
          className="hero-cta-ghost"
          onClick={() => handleScrollTo('workflow')}
        >
          <span>See how it works</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Real-time trust metrics */}
      <div className="hero-stats">
        {HERO_STATS.map((s) => (
          <div className="hero-stat" key={s.label}>
            <span className="hero-stat-icon">{getStatIcon(s.label)}</span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Right Column: 3D Visualization + Dynamic Interactive Dropzone Widget */}
    <div className="hero-modern-visual">
      {/* Interactive Glass Parsing Sandbox Widget */}
      <div className="hero-interactive-card">
        <div className="interactive-card-blur" />
        <div className="interactive-card-header">
          <div className="window-dots">
            <span className="dot red" />
            <span className="dot yellow" />
            <span className="dot green" />
          </div>
          <span className="status-indicator">
            <span className="pulse-dot" />
            Live AI Sandbox
          </span>
        </div>
        
        <div className="interactive-card-body">
          <p className="sandbox-instructions">Drop a draft document below to test parsing</p>
          <UploadBox onFileSelect={handleFileSelect} variant="compact-dark" />
          
          {file && (
            <button 
              onClick={handleGenerateForm} 
              className={`sandbox-generate-btn ${uploading ? 'processing' : ''}`}
              disabled={uploading}
            >
              <Brain size={16} />
              <span>{uploading ? 'Analyzing structure...' : 'Generate Form Instantly'}</span>
              <ArrowRight size={14} className="btn-arrow" />
            </button>
          )}
        </div>
      </div>

      {/* Base 3D Frame */}
      <div className="hero-3d-frame">
        <img
          src={rocket}
          alt="3D Rocket Illustration"
          className="hero-3d-img"
        />
      </div>
    </div>
  </div>
</section>

      {/* ==================== 2. WORKFLOW ==================== */}
      <section
        className="workflow-section"
        id="workflow"
        ref={workflowRef}
      >
        <div className="section-head">
          <Eyebrow>WORKFLOW</Eyebrow>
          <h2>Five steps. Zero friction.</h2>
          <p className="section-lede">
            From static document to live, shareable form — in the time it takes
            to grab a coffee.
          </p>
        </div>

        <div className="workflow-grid">
          {WORKFLOW.map((s, i) => (
            <WorkflowCard
              key={s.title}
              step={s.step}
              title={s.title}
              desc={s.desc}
              icon={s.icon}
              isActive={i === activeStep}
              onMouseEnter={() => setActiveStep(i)}
            />
          ))}
        </div>
      </section>

      {/* ==================== 3. WELCOME ==================== */}
      <section className="welcome-section">
        <div className="welcome-container">
          <div className="welcome-visual">
            <img src={cloud} alt="Cloud" width={420} height={420} />
          </div>
          <div className="welcome-copy">
            <Eyebrow>WELCOME TO</Eyebrow>
            <h2>
              AI-Powered Form
              <br />
              Generation
            </h2>
            <p>
              Built for teams that live in documents — questionnaires, intake
              forms, surveys, quizzes. Point at a file and let Gemini AI extract
              the structure, question types, and options automatically.
            </p>
            <p>
              No manual re-typing. No copy-paste. Just upload, review, and
              publish straight to Google Forms.
            </p>
            <PillButton
              variant="coral"
              onClick={() => handleScrollTo('split-cta')}
            >
              LEARN MORE
            </PillButton>
          </div>
        </div>
      </section>

      {/* ==================== 4. ASSET SHOWCASE ==================== */}
      <AssetShowcase />

      {/* ==================== 5. NAVY BAND ==================== */}
      <section className="navy-band">
        <div className="navy-band-container">
          <div className="band-copy">
            <Eyebrow light>AI ENGINE</Eyebrow>
            <h2>Smart Extraction</h2>
            <p>
              Our parser understands context — it groups related fields, detects
              multiple-choice options, catches required markers, and preserves
              order.
            </p>
            <p>
              Draft auto-save runs every 30 seconds so your work is never lost
              between edits.
            </p>
            <PillButton
              variant="coral"
              onClick={() => handleScrollTo('split-cta')}
            >
              LEARN MORE
            </PillButton>
          </div>

          <aside className="feature-card-coral">
            <Eyebrow light>POWERED BY</Eyebrow>
            <h3>Gemini AI</h3>
            <ul className="feature-list">
              {FEATURES.map(({ icon: Icon, label }) => (
                <li key={label} className="feature-item">
                  <span className="feature-icon">
                    <Icon size={14} />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* ==================== 6. PORTFOLIO ==================== */}
      <section className="portfolio-section">
        <div className="portfolio-head">
          <div>
            <Eyebrow>TEMPLATES</Eyebrow>
            <h2>Start from a template</h2>
          </div>
          <PillButton variant="outline" onClick={() => navigate('/my-forms')}>
            VIEW ALL
          </PillButton>
        </div>

        <div className="portfolio-grid">
          {TEMPLATES.map((t) => (
            <article key={t.title} className="portfolio-card">
              <div
                className="portfolio-img"
                style={{ background: t.gradient }}
              >
                <span className="portfolio-tag">{t.tag}</span>
              </div>
              <div className="portfolio-body">
                <div>
                  <h4>{t.title}</h4>
                  <span className="light">{t.subtitle}</span>
                </div>
                <button
                  className="mini-arrow"
                  onClick={() => navigate('/')}
                  aria-label={`Open ${t.title}`}
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ==================== 7. SPLIT CTA ==================== */}
      <section className="split-cta" id="split-cta" ref={splitRef}>
        <div className="split-cta-panel split-cta-panel--coral">
          <div className="split-copy">
            <Eyebrow light>START NOW</Eyebrow>
            <h3>Upload Your File</h3>
            <p>Drop a DOCX or TXT — we'll handle the rest.</p>
            <UploadBox
              onFileSelect={handleFileSelect}
              variant="compact-dark"
            />
            <PillButton
              variant="white"
              onClick={handleGenerateForm}
              disabled={!file || uploading}
              style={{ marginTop: 24 }}
            >
              {uploading ? 'PROCESSING...' : 'GENERATE FORM'}
            </PillButton>
          </div>
        </div>

        <div className="split-cta-panel split-cta-panel--navy">
          <div className="split-copy">
            <Eyebrow light>ALREADY HAVE FORMS</Eyebrow>
            <h3>Open Dashboard</h3>
            <p>Search, copy, and manage every form you've generated.</p>
            <PillButton variant="coral" onClick={() => navigate('/my-forms')}>
              MY FORMS
            </PillButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;