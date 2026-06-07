import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  name: string;
  username: string;
  bio: string;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;

  init: () => () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, username: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'name' | 'bio'>>) => Promise<void>;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, name, username, bio')
    .eq('id', userId)
    .single();
  return data ?? null;
}

export const useAuth = create<AuthState>()((set) => ({
  session: null,
  profile: null,
  loading: true,

  init() {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const profile = session ? await fetchProfile(session.user.id) : null;
      set({ session, profile, loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const profile = session ? await fetchProfile(session.user.id) : null;
        set({ session, profile });
      }
    );

    return () => subscription.unsubscribe();
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  },

  async signUp(email, password, name, username) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, username } },
    });
    return { error: error?.message ?? null };
  },

  async signOut() {
    await supabase.auth.signOut();
    set({ session: null, profile: null });
  },

  async updateProfile(updates) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single();
    if (data) set({ profile: data });
  },
}));
