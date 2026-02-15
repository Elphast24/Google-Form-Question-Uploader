import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UploadBox from '../components/UploadBox';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import { uploadFile } from '../services/api';
import { FileText, Sparkles, Zap } from 'lucide-react';
import '../styles/global.css';

const Home = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleGenerateForm = async () => {
    if (!user) {
      try {
        await signIn();
      } catch (error) {
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
      const response = await uploadFile(file);
      
      // Navigate to preview page with questions
      navigate('/preview', { 
        state: { 
          questions: response.questions,
          fileName: file.name 
        } 
      });
    } catch (error) {
      setError(error.message || 'Failed to process file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <main className="home-page">
        <div className="home-hero">
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

          <div className="home-features">
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
        </div>

        <div className="home-upload-section">
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

          {user && (
            <button
              onClick={() => navigate('/my-forms')}
              className="button-secondary"
            >
              View My Forms
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;