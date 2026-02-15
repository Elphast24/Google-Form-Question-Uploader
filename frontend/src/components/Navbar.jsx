import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import '../styles/global.css';

const Navbar = () => {
  const { user, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="#4285F4" strokeWidth="2"/>
            <path d="M3 9h18M9 3v18" stroke="#4285F4" strokeWidth="2"/>
          </svg>
          <span>AI Form Generator</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          {user && (
            <Link to="/my-forms" className="navbar-link">
              My Forms
            </Link>
          )}
          
          {user ? (
            <div className="navbar-user">
              <img src={user.picture} alt={user.name} className="navbar-user-avatar" />
              <span className="navbar-user-name">{user.name}</span>
              <button onClick={handleSignOut} className="navbar-button-secondary">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="navbar-button-primary">
              <User size={18} />
              Sign in with Google
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          {user && (
            <Link 
              to="/my-forms" 
              className="navbar-mobile-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Forms
            </Link>
          )}
          
          {user ? (
            <>
              <div className="navbar-mobile-user">
                <img src={user.picture} alt={user.name} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }} 
                className="navbar-button-secondary"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <button onClick={handleSignIn} className="navbar-button-primary">
              <User size={18} />
              Sign in with Google
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;