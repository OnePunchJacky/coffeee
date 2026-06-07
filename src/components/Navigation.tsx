import { NavLink, useLocation } from 'react-router-dom';
import { Home, PlusCircle, User } from 'lucide-react';

export function Navigation() {
  const location = useLocation();

  if (location.pathname === '/checkin/new') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-cream-200 z-50">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-6 pb-safe">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              isActive ? 'text-caramel-400' : 'text-gray-400'
            }`
          }
        >
          <Home size={22} />
          <span className="text-[10px] font-semibold tracking-wide uppercase">Feed</span>
        </NavLink>

        <NavLink
          to="/checkin/new"
          className="flex items-center justify-center w-14 h-14 bg-espresso-800 rounded-full shadow-lg shadow-espresso-900/30 -mt-5 text-white transition-transform active:scale-90"
        >
          <PlusCircle size={26} strokeWidth={2} />
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors ${
              isActive ? 'text-caramel-400' : 'text-gray-400'
            }`
          }
        >
          <User size={22} />
          <span className="text-[10px] font-semibold tracking-wide uppercase">Profile</span>
        </NavLink>
      </div>
    </nav>
  );
}
