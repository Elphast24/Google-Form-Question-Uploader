import React, { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useGSAPAnimation } from '@/hooks/useGSAPAnimation';
import CloudArrowsSVG from '@/components/maritime/CloudArrowsSVG';
import PillButton from '@/components/maritime/PillButton';
import '../styles/global.css';

interface User {
  uid: string;
  name: string | null;
  email: string | null;
  picture: string | null;
}

interface AuthContextShape {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const Navbar: React.FC = () => {
  const { user, signIn, signOut } = useAuth() as AuthContextShape;
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { reduceMotion, effective } = useGSAPAnimation();
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reduceMotion || !navRef.current) return;

    gsap.from(navRef.current, {
      y: -30,
      opacity: 0,
      duration: effective(0.5),
      ease: 'power2.out',
    });

    gsap.from('.logo-medallion', {
      scale: 0.8,
      opacity: 0,
      duration: effective(0.6),
      ease: 'back.out(1.4)',
      delay: 0.2,
    });
  }, [reduceMotion, effective]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch {
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch {
      alert('Failed to sign out. Please try again.');
    }
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar-link${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar-maritime" ref={navRef}>
      <div className="navbar-shell">
        <NavLink to="/" className="navbar-logo-pod" end>
          <div className="logo-medallion">
            <CloudArrowsSVG size={32} animate={false} />
          </div>
          <span className="logo-wordmark">
            AI<span className="logo-accent">Forms</span>
          </span>
        </NavLink>

        <ul className="navbar-menu">
          <li><NavLink to="/" end className={getNavLinkClass}>Home</NavLink></li>
          <li><NavLink to="/preview" className={getNavLinkClass}>Preview</NavLink></li>
          <li><NavLink to="/my-forms" className={getNavLinkClass}>My Forms</NavLink></li>
          <li><NavLink to="/drafts" className={getNavLinkClass}>Drafts</NavLink></li>
        </ul>

        <div className="navbar-user">
          {user ? (
            <>
              <img
                src={user.picture || ''}
                alt={user.name || 'User'}
                className="navbar-user-avatar"
              />
              <span className="navbar-user-name">{user.name}</span>
              <button
                onClick={handleSignOut}
                className="navbar-button-secondary"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignIn}
              className="navbar-button-primary"
            >
              <User size={18} />
              Sign in
            </button>
          )}
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <NavLink to="/" end className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/preview" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Preview
          </NavLink>
          <NavLink to="/my-forms" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            My Forms
          </NavLink>
          <NavLink to="/drafts" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Drafts
          </NavLink>
          {user ? (
            <button onClick={handleSignOut} className="navbar-button-secondary">
              <LogOut size={18} />
              Sign Out
            </button>
          ) : (
            <button onClick={handleSignIn} className="navbar-button-primary">
              <User size={18} />
              Sign in
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

Navbar.displayName = 'Navbar';

export default Navbar;
