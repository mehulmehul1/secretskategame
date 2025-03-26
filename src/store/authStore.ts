import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateLocation: (latitude: number, longitude: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  signUp: async (email, password, username) => {
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) throw signUpError;

    if (authData.user) {
      // Create user profile
      const { error: profileError } = await supabase.from('user_profiles').insert({
        id: authData.user.id,
        username,
        rank: 'rookie',
        xp: 0,
      });

      if (profileError) throw profileError;
    }

    set({ user: authData.user, session: authData.session });
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    set({ user: data.user, session: data.session });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
  updateLocation: async (latitude, longitude) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_locations').upsert({
      user_id: user.id,
      location: `POINT(${longitude} ${latitude})`,
      last_updated: new Date().toISOString(),
    });
  },
}));