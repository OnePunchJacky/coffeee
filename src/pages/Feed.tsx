import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuth } from '../store/useAuth';
import { CheckInCard } from '../components/CheckInCard';

function SkeletonCard() {
  return (
    <div className="card mx-3 mt-3 p-4 space-y-3 animate-pulse">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-2.5 bg-gray-100 rounded w-16" />
        </div>
        <div className="h-5 bg-gray-100 rounded-full w-20" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-full" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
  );
}

export function Feed() {
  const { feed, feedLoading, loadFeed } = useStore();
  const { profile } = useAuth();

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 bg-espresso-800 text-white">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 pt-safe pb-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">coffeee</h1>
            <p className="text-espresso-300 text-xs mt-0.5">Your coffee feed</p>
          </div>
          {profile && (
            <div className="w-9 h-9 rounded-full bg-caramel-400 flex items-center justify-center text-white font-bold text-sm">
              {profile.name[0].toUpperCase()}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-lg mx-auto mb-nav pt-2 pb-4">
        {feedLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 mt-8 text-gray-400">
            <span className="text-5xl mb-4">☕</span>
            <p className="font-semibold text-gray-600">No check-ins yet</p>
            <p className="text-sm mt-1">Tap + to log your first coffee</p>
          </div>
        ) : (
          feed.map(checkIn => <CheckInCard key={checkIn.id} checkIn={checkIn} />)
        )}
      </main>
    </div>
  );
}
