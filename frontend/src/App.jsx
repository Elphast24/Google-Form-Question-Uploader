import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Preview from './pages/Preview';
import Generated from './pages/Generated';
import MyForms from './pages/MyForms';
import AuthCallback from './pages/AuthCallback';
import './styles/global.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loader"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* OAuth Callback Route - Must be accessible without authentication */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            <Route 
              path="/preview" 
              element={
                <ProtectedRoute>
                  <Preview />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generated" 
              element={
                <ProtectedRoute>
                  <Generated />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-forms" 
              element={
                <ProtectedRoute>
                  <MyForms />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;