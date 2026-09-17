import { lazy, ReactNode, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WorkspacePage from './pages/WorkspacePage';
import { Spinner } from './components/shared/Spinner';
import './styles/global.css';

const Generated = lazy(() => import('./pages/Generated'));
const MyForms = lazy(() => import('./pages/MyForms'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner label="Loading…" />
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
            <div className="flex items-center justify-center min-h-screen">
              <Spinner label="Loading…" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<WorkspacePage />} />
            <Route path="/preview" element={<Navigate to="/" replace />} />
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
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
