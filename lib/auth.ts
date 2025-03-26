import { create } from 'zustand';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  skill_level: string;
  is_active: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
}

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  updateLocation: (latitude: number, longitude: number) => Promise<void>;
  setActive: (isActive: boolean) => Promise<void>;
}

export const useAuth = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  loading: true,

  signUp: async (email: string, password: string, username: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });
    if (error) throw error;
  },

  signIn: async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session?.user.id)
      .single();

    set({ session: data.session, profile });
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    set({ session: null, profile: null });
  },

  updateProfile: async (updates) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', get().session?.user.id);
    
    if (error) throw error;

    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    }));
  },

  updateLocation: async (latitude: number, longitude: number) => {
    const point = `POINT(${longitude} ${latitude})`;
    const { error } = await supabase
      .from('profiles')
      .update({
        location: point,
        last_active: new Date().toISOString(),
      })
      .eq('id', get().session?.user.id);
    
    if (error) throw error;

    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            location: { latitude, longitude },
          }
        : null,
    }));
  },

  setActive: async (isActive: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({
        is_active: isActive,
        last_active: new Date().toISOString(),
      })
      .eq('id', get().session?.user.id);
    
    if (error) throw error;

    set((state) => ({
      profile: state.profile
        ? {
            ...state.profile,
            is_active: isActive,
          }
        : null,
    }));
  },
}));