import { useFeed, useCurrentUser } from '../store/useStore';
import { CheckInCard } from '../components/CheckInCard';

export function Feed() {
  const feed = useFeed();
  const user = useCurrentUser();

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-espresso-800 text-white">
        <div className="max-w-lg mx-auto flex items-center justify-between px-4 pt-safe pb-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none">coffeee</h1>
            <p className="text-espresso-300 text-xs mt-0.5">Your coffee feed</p>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-caramel-400 flex items-center justify-center text-white font-bold text-sm"
          >
            {user.name[0]}
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="max-w-lg mx-auto mb-nav pt-2 pb-4">
        {feed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 mt-8">
            <span className="text-5xl mb-4">☕</span>
            <p className="font-semibold text-gray-600">No check-ins yet</p>
            <p className="text-sm mt-1 text-gray-400">Tap + to log your first coffee</p>
          </div>
        ) : (
          feed.map(checkIn => <CheckInCard key={checkIn.id} checkIn={checkIn} />)
        )}
      </main>
    </div>
  );
}
