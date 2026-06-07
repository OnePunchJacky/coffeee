import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Feed } from './pages/Feed';
import { NewCheckIn } from './pages/NewCheckIn';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/checkin/new" element={<NewCheckIn />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Navigation />
    </>
  );
}
