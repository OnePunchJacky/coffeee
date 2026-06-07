import { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../store/useAuth';
import { useStore, useBadges } from '../store/useStore';
import { CheckInCard } from '../components/CheckInCard';
import { RatingStars } from '../components/RatingStars';
import { BREW_METHODS } from '../types';
import { Badge } from '../types';

const ORIGIN_FLAGS: Record<string, string> = {
  Ethiopia: '🇪🇹', Kenya: '🇰🇪', Rwanda: '🇷🇼', Tanzania: '🇹🇿',
  Colombia: '🇨🇴', Brazil: '🇧🇷', Peru: '🇵🇪', Guatemala: '🇬🇹',
  Honduras: '🇭🇳', Panama: '🇵🇦', Indonesia: '🇮🇩', Yemen: '🇾🇪',
  'Costa Rica': '🇨🇷', Nicaragua: '🇳🇮', 'El Salvador': '🇸🇻',
};

function getFlag(origin: string) {
  for (const [c, f] of Object.entries(ORIGIN_FLAGS)) {
    if (origin.includes(c)) return f;
  }
  return '🌍';
}

export function Profile() {
  const { profile, signOut } = useAuth();
  const { userCheckIns, loadUserCheckIns } = useStore();
  const badges = useBadges();

  useEffect(() => {
    if (profile?.id) loadUserCheckIns(profile.id);
  }, [profile?.id]);

  const checkIns = userCheckIns;
  const uniqueOrigins = new Set(checkIns.map(c => c.coffee.origin)).size;
  const uniqueRoasteries = new Set(checkIns.map(c => c.coffee.roastery)).size;
  const avgRating = checkIns.length > 0
    ? checkIns.reduce((s, c) => s + c.rating, 0) / checkIns.length
    : 0;

  const originCounts = checkIns.reduce<Record<string, number>>((acc, c) => {
    acc[c.coffee.origin] = (acc[c.coffee.origin] ?? 0) + 1;
    return acc;
  }, {});
  const topOrigins = Object.entries(originCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const brewCounts = checkIns.reduce<Record<string, number>>((acc, c) => {
    acc[c.brewMethod] = (acc[c.brewMethod] ?? 0) + 1;
    return acc;
  }, {});
  const topBrews = Object.entries(brewCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id, count]) => ({ method: BREW_METHODS.find(m => m.id === id), count }))
    .filter(x => x.method != null);

  const earnedCount = badges.filter(b => b.earned).length;

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-espresso-800 text-white">
        <div className="max-w-lg mx-auto px-4 pt-safe pb-5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Profile</h1>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 text-espresso-300 hover:text-white text-sm transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-caramel-400 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
              {profile.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-xl font-black leading-snug">{profile.name}</p>
              <p className="text-espresso-300 text-sm">@{profile.username}</p>
              {profile.bio && <p className="text-espresso-200 text-xs mt-1">{profile.bio}</p>}
            </div>
          </div>

          <div className="mt-4 bg-espresso-950 rounded-2xl px-4 py-3 flex">
            <Stat value={checkIns.length} label="Check-ins" />
            <div className="w-px bg-espresso-800 mx-2" />
            <Stat value={uniqueOrigins} label="Origins" />
            <div className="w-px bg-espresso-800 mx-2" />
            <Stat value={uniqueRoasteries} label="Roasteries" />
            <div className="w-px bg-espresso-800 mx-2" />
            <Stat value={avgRating > 0 ? avgRating.toFixed(1) : '—'} label="Avg. Rating" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto mb-nav pb-4">
        {/* Taste Profile */}
        {checkIns.length > 0 && (
          <section className="card mx-3 mt-4 p-4">
            <h3 className="font-bold text-espresso-900 mb-4">Taste Profile</h3>

            {topOrigins.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Top Origins</p>
                <div className="space-y-2">
                  {topOrigins.map(([origin, count]) => (
                    <div key={origin} className="flex items-center gap-2">
                      <span className="text-base">{getFlag(origin)}</span>
                      <span className="text-sm text-espresso-800 w-28 truncate font-medium">{origin}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-caramel-400 h-2 rounded-full"
                          style={{ width: `${(count / checkIns.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {topBrews.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Brew Methods</p>
                <div className="flex gap-2 flex-wrap">
                  {topBrews.map(({ method, count }) => (
                    <div key={method!.id} className="flex flex-col items-center bg-cream-50 border border-cream-200 rounded-xl px-3 py-2 min-w-[64px]">
                      <span className="text-2xl">{method!.emoji}</span>
                      <span className="text-xs font-semibold text-espresso-800 mt-1">{method!.label}</span>
                      <span className="text-xs text-gray-400">{count}×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {checkIns.length >= 3 && (
              <div className="mt-4 pt-4 border-t border-cream-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">Average Rating</p>
                <RatingStars rating={parseFloat(avgRating.toFixed(1))} size="md" />
              </div>
            )}
          </section>
        )}

        {/* Badges */}
        <section className="card mx-3 mt-4 p-4">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="font-bold text-espresso-900">Badges</h3>
            <span className="text-sm text-gray-400">{earnedCount} / {badges.length} earned</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {badges.map(badge => <BadgeItem key={badge.id} badge={badge} />)}
          </div>
        </section>

        {/* Check-ins */}
        {checkIns.length > 0 ? (
          <section className="mt-4">
            <h3 className="font-bold text-espresso-900 px-4 mb-1">My Check-ins</h3>
            {checkIns.slice(0, 6).map(c => <CheckInCard key={c.id} checkIn={c} />)}
          </section>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 mt-8">
            <span className="text-5xl mb-3">☕</span>
            <p className="font-semibold text-gray-600">No check-ins yet</p>
            <p className="text-sm mt-1">Tap + to start your coffee journey</p>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex-1 text-center">
      <p className="text-xl font-black text-white leading-none">{value}</p>
      <p className="text-[10px] text-espresso-400 mt-0.5 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}

function BadgeItem({ badge }: { badge: Badge }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${badge.earned ? '' : 'opacity-40'}`} title={badge.description}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${badge.earned ? 'bg-caramel-400/20 border-2 border-caramel-400/40' : 'bg-gray-100'}`}>
        {badge.icon}
      </div>
      <p className="text-[10px] text-center text-espresso-800 font-semibold leading-tight line-clamp-2">{badge.name}</p>
      {!badge.earned && badge.target > 1 && (
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div className="bg-caramel-400 h-1 rounded-full" style={{ width: `${(badge.progress / badge.target) * 100}%` }} />
        </div>
      )}
    </div>
  );
}
