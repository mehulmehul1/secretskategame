import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number;
  longitude: number;
  error: string | null;
  loading: boolean;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: 0,
    longitude: 0,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        error: 'Geolocation is not supported',
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setLocation(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    // Get initial position
    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

    // Watch for position changes
    const watchId = navigator.geolocation.watchPosition(successHandler, errorHandler);

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return location;
}