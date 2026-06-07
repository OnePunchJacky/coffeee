import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import { CheckIn, BREW_METHODS } from '../types';
import { useStore, useUserName } from '../store/useStore';
import { RatingStars } from './RatingStars';

const ORIGIN_FLAGS: Record<string, string> = {
  Ethiopia: '🇪🇹', Kenya: '🇰🇪', Rwanda: '🇷🇼', Tanzania: '🇹🇿', Uganda: '🇺🇬',
  Burundi: '🇧🇮', Malawi: '🇲🇼', Zambia: '🇿🇲', Congo: '🇨🇩', Cameroon: '🇨🇲',
  Colombia: '🇨🇴', Brazil: '🇧🇷', Peru: '🇵🇪', Bolivia: '🇧🇴', Ecuador: '🇪🇨',
  Guatemala: '🇬🇹', Honduras: '🇭🇳', Mexico: '🇲🇽', 'Costa Rica': '🇨🇷',
  Nicaragua: '🇳🇮', 'El Salvador': '🇸🇻', Panama: '🇵🇦', Cuba: '🇨🇺',
  Jamaica: '🇯🇲', Hawaii: '🇺🇸', Indonesia: '🇮🇩', Vietnam: '🇻🇳',
  India: '🇮🇳', Yemen: '🇾🇪', Laos: '🇱🇦', Thailand: '🇹🇭',
  'Papua New Guinea': '🇵🇬',
};

function getFlag(origin: string): string {
  for (const [country, flag] of Object.entries(ORIGIN_FLAGS)) {
    if (origin.includes(country)) return flag;
  }
  return '🌍';
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const AVATAR_COLORS = ['#C67B2A', '#7A3F15', '#5C2D0A', '#9B5523', '#3D1C02', '#A0622E'];

function avatarColor(userId: string): string {
  let h = 0;
  for (const c of userId) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

interface Props {
  checkIn: CheckIn;
}

export function CheckInCard({ checkIn }: Props) {
  const toggleLike = useStore(s => s.toggleLike);
  const currentUserId = useStore(s => s.currentUserId);
  const userName = useUserName(checkIn.userId);
  const hasLiked = checkIn.likes.includes(currentUserId);
  const brewMethod = BREW_METHODS.find(m => m.id === checkIn.brewMethod);
  const timeAgo = formatDistanceToNow(new Date(checkIn.createdAt), { addSuffix: true });

  return (
    <article className="card mx-3 mt-3">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: avatarColor(checkIn.userId) }}
        >
          {getInitials(userName)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-espresso-900 text-sm leading-tight">{userName}</p>
          <p className="text-gray-400 text-xs">{timeAgo}</p>
        </div>
        {brewMethod && (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-cream-100 text-espresso-700 rounded-full border border-cream-200">
            <span>{brewMethod.emoji}</span>
            <span>{brewMethod.label}</span>
          </span>
        )}
      </div>

      {/* Coffee info */}
      <div className="px-4 pb-2">
        <h2 className="text-base font-bold text-espresso-900 leading-snug">{checkIn.coffee.name}</h2>
        <p className="text-caramel-500 font-semibold text-sm">{checkIn.coffee.roastery}</p>
        <p className="text-gray-400 text-xs mt-0.5 flex flex-wrap gap-x-1.5">
          <span>{getFlag(checkIn.coffee.origin)} {checkIn.coffee.origin}</span>
          <span>·</span>
          <span className="capitalize">{checkIn.coffee.processing}</span>
          <span>·</span>
          <span className="capitalize">{checkIn.coffee.roastLevel.replace('-', ' ')} roast</span>
        </p>
      </div>

      {/* Rating */}
      <div className="px-4 pb-2">
        <RatingStars rating={checkIn.rating} size="sm" />
      </div>

      {/* Notes */}
      {checkIn.notes ? (
        <p className="px-4 pb-3 text-sm text-gray-700 leading-relaxed line-clamp-3">
          {checkIn.notes}
        </p>
      ) : null}

      {/* Aroma tags */}
      {checkIn.aromaProfile.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-1.5">
          {checkIn.aromaProfile.map(aroma => (
            <span
              key={aroma}
              className="text-xs px-2 py-0.5 bg-espresso-50 text-espresso-700 rounded-full border border-espresso-100"
            >
              {aroma}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2.5 border-t border-cream-100">
        <button
          onClick={() => toggleLike(checkIn.id)}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl text-sm font-medium transition-all active:scale-90 ${
            hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={17} fill={hasLiked ? 'currentColor' : 'none'} strokeWidth={2} />
          {checkIn.likes.length > 0 && <span>{checkIn.likes.length}</span>}
        </button>
      </div>
    </article>
  );
}
