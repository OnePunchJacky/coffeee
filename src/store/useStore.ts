import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { CheckIn, BrewMethod, ProcessingMethod, RoastLevel } from '../types';
import { computeBadges } from '../utils/badges';

type NewCheckInData = Omit<CheckIn, 'id' | 'userId' | 'createdAt' | 'likes'>;

interface DataState {
  feed: CheckIn[];
  feedLoading: boolean;
  userCheckIns: CheckIn[];
  profiles: Record<string, { name: string; username: string }>;

  loadFeed: () => Promise<void>;
  loadUserCheckIns: (userId: string) => Promise<void>;
  addCheckIn: (data: NewCheckInData) => Promise<{ error: string | null }>;
  toggleLike: (checkInId: string, userId: string) => Promise<void>;
}

function toCheckIn(row: Record<string, unknown>): CheckIn {
  const likes = (row.likes as { user_id: string }[] | null) ?? [];
  return {
    id: row.id as string,
    userId: row.user_id as string,
    createdAt: row.created_at as string,
    coffee: {
      name: row.coffee_name as string,
      roastery: row.roastery as string,
      origin: row.origin as string,
      processing: row.processing as ProcessingMethod,
      roastLevel: row.roast_level as RoastLevel,
    },
    brewMethod: row.brew_method as BrewMethod,
    rating: parseFloat(String(row.rating)),
    aromaProfile: (row.aroma_profile as string[]) ?? [],
    notes: (row.notes as string) ?? '',
    likes: likes.map(l => l.user_id),
  };
}

export const useStore = create<DataState>()((set, get) => ({
  feed: [],
  feedLoading: false,
  userCheckIns: [],
  profiles: {},

  async loadFeed() {
    set({ feedLoading: true });
    const { data, error } = await supabase
      .from('checkins')
      .select('*, profiles!checkins_user_id_fkey(name, username), likes(user_id)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) {
      set({ feedLoading: false });
      return;
    }

    const profiles: Record<string, { name: string; username: string }> = {};
    const feed = data.map(row => {
      if (row.profiles) {
        profiles[row.user_id] = row.profiles as { name: string; username: string };
      }
      return toCheckIn(row as Record<string, unknown>);
    });

    set({ feed, profiles: { ...get().profiles, ...profiles }, feedLoading: false });
  },

  async loadUserCheckIns(userId: string) {
    const { data, error } = await supabase
      .from('checkins')
      .select('*, likes(user_id)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ userCheckIns: data.map(r => toCheckIn(r as Record<string, unknown>)) });
    }
  },

  async addCheckIn(data) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return { error: 'Not authenticated' };

    const { data: inserted, error } = await supabase
      .from('checkins')
      .insert({
        user_id: session.user.id,
        coffee_name: data.coffee.name,
        roastery: data.coffee.roastery,
        origin: data.coffee.origin,
        processing: data.coffee.processing,
        roast_level: data.coffee.roastLevel,
        brew_method: data.brewMethod,
        rating: data.rating,
        aroma_profile: data.aromaProfile,
        notes: data.notes,
      })
      .select('*, profiles!checkins_user_id_fkey(name, username), likes(user_id)')
      .single();

    if (error) return { error: error.message };

    const newCheckIn = toCheckIn(inserted as Record<string, unknown>);
    set(state => ({
      feed: [newCheckIn, ...state.feed],
      userCheckIns: [newCheckIn, ...state.userCheckIns],
    }));
    return { error: null };
  },

  async toggleLike(checkInId: string, userId: string) {
    const { feed } = get();
    const checkIn = feed.find(c => c.id === checkInId);
    if (!checkIn) return;

    const hasLiked = checkIn.likes.includes(userId);

    // Optimistic update
    const toggle = (c: CheckIn) =>
      c.id !== checkInId ? c : {
        ...c,
        likes: hasLiked
          ? c.likes.filter(id => id !== userId)
          : [...c.likes, userId],
      };

    set(state => ({ feed: state.feed.map(toggle) }));

    if (hasLiked) {
      await supabase.from('likes')
        .delete()
        .eq('checkin_id', checkInId)
        .eq('user_id', userId);
    } else {
      await supabase.from('likes')
        .insert({ checkin_id: checkInId, user_id: userId });
    }
  },
}));

export function useUserName(userId: string): string {
  return useStore(s => s.profiles[userId]?.name ?? 'Coffee lover');
}

export function useBadges() {
  return useStore(s => computeBadges(s.userCheckIns));
}
