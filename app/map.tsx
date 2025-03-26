import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { useOnlineSkaters } from '../hooks/useOnlineSkaters';
import { useAuthStore } from '../store/authStore';
import { Feather } from '@expo/vector-icons';

export default function Map() {
  const { latitude, longitude, loading: locationLoading } = useLocation();
  const { skaters, loading: skatersLoading } = useOnlineSkaters();
  const { user, updateLocation } = useAuthStore();

  useEffect(() => {
    if (latitude && longitude && user) {
      updateLocation(latitude, longitude);
    }
  }, [latitude, longitude, user, updateLocation]);

  if (locationLoading || skatersLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Current user marker */}
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          title="You"
        />

        {/* Other skaters */}
        {skaters
          .filter(skater => skater.id !== user?.id)
          .map(skater => (
            <Marker
              key={skater.id}
              coordinate={{
                latitude: skater.latitude,
                longitude: skater.longitude,
              }}
              title={skater.username}
            />
          ))}
      </MapView>

      <TouchableOpacity style={styles.addButton}>
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});