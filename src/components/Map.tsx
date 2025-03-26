import { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';

export default function SkateMap() {
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 13
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setViewport(prev => ({ ...prev, latitude, longitude }));
      });
    }
  }, []);

  return (
    <Map
      mapboxAccessToken="pk.eyJ1IjoibWVodWxreXUiLCJhIjoiY204bjRzNnl5MWh2NDJscXlsMGU3MHFkYyJ9.XQhBapu5KsOt_Qk0DSKusA"
      initialViewState={viewport}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker
        longitude={viewport.longitude}
        latitude={viewport.latitude}
      >
        <MapPin className="text-blue-500" size={32} />
      </Marker>
    </Map>
  );
}