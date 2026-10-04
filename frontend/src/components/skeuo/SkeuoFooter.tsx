import React from 'react';

const SkeuoFooter: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} AI Form Generator. Powered by Gemini AI &amp; Google Forms API.
          </p>
          <div className="footer-links">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
            <span className="footer-divider">•</span>
            <a
              href="https://docs.google.com/forms"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Google Forms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

SkeuoFooter.displayName = 'SkeuoFooter';

export default SkeuoFooter;
