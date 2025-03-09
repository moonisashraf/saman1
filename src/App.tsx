import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, getCurrentUser } from './lib/supabase';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ProjectEditor from './pages/ProjectEditor';
import AuthModal from './components/AuthModal';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage onAuth={setAuthModal} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="/editor/:projectId?" element={user ? <ProjectEditor /> : <Navigate to="/" replace />} />
      </Routes>

      {authModal && (
        <AuthModal
          type={authModal}
          onClose={() => setAuthModal(null)}
        />
      )}
    </>
  );
}

export default App