import React from 'react';
import '../styles/global.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} AI Form Generator. Powered by Gemini AI & Google Forms API.
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

export default Footer;