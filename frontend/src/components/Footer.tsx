import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import CloudArrowsSVG from './maritime/CloudArrowsSVG';

const Footer: React.FC = () => {
  return (
    <footer className="footer-maritime">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="logo-medallion logo-medallion--dark">
            <CloudArrowsSVG size={32} animate={false} />
          </div>
          <p className="footer-tagline">
            Transforming documents into intelligent forms with AI.
          </p>
          <div className="footer-social">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
            <a
              href="https://docs.google.com/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="social-circle"
              aria-label="Google Forms"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Helpful Links</h4>
          <span className="link-rule" />
          <div className="footer-links">
            <a href="/" className="footer-link">Home</a>
            <a href="/preview" className="footer-link">Preview</a>
            <a href="/my-forms" className="footer-link">My Forms</a>
            <a href="/drafts" className="footer-link">Drafts</a>
          </div>
        </div>

        <div className="footer-contact">
          <h4>Contact info</h4>
          <span className="link-rule" />
          <p>
            <Github size={16} className="ico-coral" />
            support@aiforms.com
          </p>
          <p className="contact-phone">
            760-438-7361
          </p>
        </div>
      </div>
      <div className="footer-copy">
        © {new Date().getFullYear()} AI Form Generator. All Rights Reserved.
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export default Footer;
