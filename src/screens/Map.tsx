import { useState, useCallback, useEffect } from 'react';
import MapGL, { Marker, Popup, ViewState } from 'react-map-gl';
import { Plus } from 'lucide-react';
import { SkaterAvatar } from '../components/SkaterAvatar';
import { useLocation } from '../hooks/useLocation';
import { useOnlineSkaters } from '../hooks/useOnlineSkaters';
import { useAuthStore } from '../store/authStore';
import { CreateSeshModal } from '../components/CreateSeshModal';
import { SpotCard } from '../components/SpotCard';
import { SkaterPopup } from '../components/SkaterPopup';

interface Spot {
  id: string;
  name: string;
  difficulty: number;
  activeUsers: number;
  latitude: number;
  longitude: number;
}

const DUMMY_SPOTS: Spot[] = [
  {
    id: '1',
    name: 'Downtown Plaza',
    difficulty: 4,
    activeUsers: 5,
    latitude: 0,
    longitude: 0,
  },
  {
    id: '2',
    name: 'School Yard',
    difficulty: 2,
    activeUsers: 3,
    latitude: 0,
    longitude: 0,
  },
];

export function Map() {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocation();
  const { skaters, loading: skatersLoading, error: skatersError } = useOnlineSkaters();
  const { user, updateLocation } = useAuthStore();
  
  const [viewport, setViewport] = useState<Partial<ViewState>>({
    latitude: 0,
    longitude: 0,
    zoom: 15,
    bearing: 0,
    pitch: 0,
  });
  const [selectedSkater, setSelectedSkater] = useState<typeof skaters[0] | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [showCreateSesh, setShowCreateSesh] = useState(false);

  // Update viewport when location changes
  const handleViewportChange = useCallback((newViewport: ViewState) => {
    setViewport(newViewport);
  }, []);

  // Update user's location in the database
  useEffect(() => {
    if (latitude && longitude && user) {
      updateLocation(latitude, longitude);
    }
  }, [latitude, longitude, user, updateLocation]);

  if (locationLoading || skatersLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg">Loading map...</div>
      </div>
    );
  }

  if (locationError || skatersError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-lg text-red-500">
          Error: {locationError || skatersError}
        </div>
      </div>
    );
  }

  // Distribute spots around user's location
  const spots = DUMMY_SPOTS.map((spot) => ({
    ...spot,
    latitude: latitude + (Math.random() - 0.5) * 0.008,
    longitude: longitude + (Math.random() - 0.5) * 0.008,
  }));

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <MapGL
        mapboxAccessToken="pk.eyJ1IjoibWVodWxreXUiLCJhIjoiY204bjRzNnl5MWh2NDJscXlsMGU3MHFkYyJ9.XQhBapu5KsOt_Qk0DSKusA"
        initialViewState={{
          latitude,
          longitude,
          zoom: 15,
        }}
        onMove={evt => handleViewportChange(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        {/* Current user location */}
        <Marker latitude={latitude} longitude={longitude}>
          <SkaterAvatar isCurrentUser />
        </Marker>

        {/* Other skaters */}
        {skaters
          .filter(skater => skater.id !== user?.id)
          .map((skater) => (
            <Marker
              key={skater.id}
              longitude={skater.longitude}
              latitude={skater.latitude}
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedSkater(skater);
              }}
            >
              <SkaterAvatar />
            </Marker>
          ))}

        {/* Spots */}
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            longitude={spot.longitude}
            latitude={spot.latitude}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setSelectedSpot(spot);
            }}
          >
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
              <span className="text-white text-xs font-bold">{spot.difficulty}</span>
            </div>
          </Marker>
        ))}

        {/* Popups */}
        {selectedSkater && (
          <Popup
            longitude={selectedSkater.longitude}
            latitude={selectedSkater.latitude}
            onClose={() => setSelectedSkater(null)}
            offset={25}
          >
            <SkaterPopup skater={selectedSkater} />
          </Popup>
        )}

        {selectedSpot && (
          <Popup
            longitude={selectedSpot.longitude}
            latitude={selectedSpot.latitude}
            onClose={() => setSelectedSpot(null)}
            offset={25}
          >
            <SpotCard spot={selectedSpot} />
          </Popup>
        )}
      </MapGL>

      {/* Action Button */}
      <button
        onClick={() => setShowCreateSesh(true)}
        className="absolute bottom-6 right-4 p-4 bg-blue-500 rounded-full text-white shadow-lg hover:bg-blue-600 transition-colors"
      >
        <Plus size={24} />
      </button>

      {/* Create Session Modal */}
      {showCreateSesh && (
        <CreateSeshModal onClose={() => setShowCreateSesh(false)} />
      )}
    </div>
  );
}