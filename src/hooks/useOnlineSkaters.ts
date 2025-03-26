import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface OnlineSkater {
  id: string;
  username: string;
  rank: string;
  wins: number;
  latitude: number;
  longitude: number;
}

export function useOnlineSkaters() {
  const [skaters, setSkaters] = useState<OnlineSkater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkaters = async () => {
      try {
        // First get user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('id, username, rank, xp');

        if (profilesError) throw profilesError;

        // Then get locations and merge with profiles
        const { data: locations, error: locationsError } = await supabase
          .from('user_locations')
          .select('user_id, location, is_visible')
          .filter('last_updated', 'gt', new Date(Date.now() - 5 * 60 * 1000).toISOString())
          .filter('is_visible', 'eq', true);

        if (locationsError) throw locationsError;

        // Merge profiles with locations
        const formattedSkaters = locations
          .map(location => {
            const profile = profiles.find(p => p.id === location.user_id);
            if (!profile) return null;

            return {
              id: location.user_id,
              username: profile.username,
              rank: profile.rank,
              wins: Math.floor(profile.xp / 100), // Example conversion
              latitude: location.location.coordinates[1],
              longitude: location.location.coordinates[0],
            };
          })
          .filter((skater): skater is OnlineSkater => skater !== null);

        setSkaters(formattedSkaters);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skaters');
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSkaters();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel('online-skaters')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_locations',
      }, () => {
        fetchSkaters();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { skaters, loading, error };
}