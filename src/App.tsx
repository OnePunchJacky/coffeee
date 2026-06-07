import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/useAuth';
import { Navigation } from './components/Navigation';
import { Auth } from './pages/Auth';
import { Feed } from './pages/Feed';
import { NewCheckIn } from './pages/NewCheckIn';
import { Profile } from './pages/Profile';

export function App() {
  const { session, loading, init } = useAuth();

  useEffect(() => {
    const unsub = init();
    return unsub;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-espresso-800 flex flex-col items-center justify-center gap-3">
        <span className="text-5xl animate-pulse">☕</span>
        <p className="text-espresso-300 text-sm">Loading…</p>
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <>
      <Routes>
        <Route path="/"              element={<Feed />} />
        <Route path="/checkin/new"   element={<NewCheckIn />} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
      <Navigation />
    </>
  );
}
