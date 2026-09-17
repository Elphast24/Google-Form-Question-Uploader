import React, { lazy, Suspense, ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Loader from '@/components/Loader';
import '@/styles/global.css';

const Generated = lazy(() => import('@/pages/Generated'));
const Preview = lazy(() => import('@/pages/Preview'));
const MyForms = lazy(() => import('@/pages/MyForms'));
const AuthCallback = lazy(() => import('@/pages/AuthCallback'));

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container">
        <Loader text="Loading…" />
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <Suspense
          fallback={
            <div className="loader-container">
              <Loader text="Loading…" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/preview" element={<ProtectedRoute><Preview /></ProtectedRoute>} />
            <Route path="/generated" element={<ProtectedRoute><Generated /></ProtectedRoute>} />
            <Route path="/my-forms" element={<ProtectedRoute><MyForms /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
