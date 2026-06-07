import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CheckIn, User } from '../types';
import { SAMPLE_CHECKINS, SAMPLE_USERS, CURRENT_USER_ID } from '../data/sampleData';
import { computeBadges } from '../utils/badges';

interface AppState {
  currentUserId: string;
  users: Record<string, User>;
  feed: CheckIn[];
  addCheckIn: (data: Omit<CheckIn, 'id' | 'userId' | 'createdAt' | 'likes'>) => void;
  toggleLike: (checkInId: string) => void;
}

const initialUsers: Record<string, User> = {
  ...SAMPLE_USERS,
  [CURRENT_USER_ID]: {
    ...SAMPLE_USERS[CURRENT_USER_ID],
    checkIns: SAMPLE_CHECKINS.filter(c => c.userId === CURRENT_USER_ID),
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUserId: CURRENT_USER_ID,
      users: initialUsers,
      feed: SAMPLE_CHECKINS,

      addCheckIn(data) {
        const userId = get().currentUserId;
        const newCheckIn: CheckIn = {
          ...data,
          id: `ci-${crypto.randomUUID()}`,
          userId,
          createdAt: new Date().toISOString(),
          likes: [],
        };
        set(state => ({
          users: {
            ...state.users,
            [userId]: {
              ...state.users[userId],
              checkIns: [newCheckIn, ...state.users[userId].checkIns],
            },
          },
          feed: [newCheckIn, ...state.feed],
        }));
      },

      toggleLike(checkInId) {
        const userId = get().currentUserId;
        set(state => ({
          feed: state.feed.map(c => {
            if (c.id !== checkInId) return c;
            const liked = c.likes.includes(userId);
            return {
              ...c,
              likes: liked ? c.likes.filter(id => id !== userId) : [...c.likes, userId],
            };
          }),
        }));
      },
    }),
    { name: 'coffeee-v1' }
  )
);

export function useCurrentUser(): User {
  return useStore(s => s.users[s.currentUserId]);
}

export function useFeed(): CheckIn[] {
  return useStore(s => s.feed);
}

export function useBadges() {
  const user = useCurrentUser();
  return computeBadges(user.checkIns);
}

export function useUserName(userId: string): string {
  const users = useStore(s => s.users);
  return users[userId]?.name ?? 'Unknown';
}
