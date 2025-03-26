import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image } from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Plus, Users } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

// Only import MapView when not on web
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

type Skater = {
  id: string;
  username: string;
  avatar: string;
  skillLevel: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

type Spot = {
  id: string;
  name: string;
  difficulty: string;
  type: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
  };
  activeSkaters: number;
};

const MOCK_SKATERS: Skater[] = [
  {
    id: '1',
    username: 'TonyHawk',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
    skillLevel: 'Legend',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
  {
    id: '2',
    username: 'StreetKing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    skillLevel: 'Pro',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
  },
];

const MOCK_SPOTS: Spot[] = [
  {
    id: '1',
    name: 'Downtown Rails',
    difficulty: 'Expert',
    type: 'Street',
    image: 'https://images.unsplash.com/photo-1572776685600-aca8c3456177?w=400',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
    },
    activeSkaters: 3,
  },
];

export default function SpotMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedSkater, setSelectedSkater] = useState<Skater | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleStartGame = () => {
    router.push('/game/create');
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webSpotsTitle}>Active Skaters Nearby</Text>
          <View style={styles.webSkatersList}>
            {MOCK_SKATERS.map(skater => (
              <TouchableOpacity 
                key={skater.id} 
                style={styles.webSkaterCard}
                onPress={() => setSelectedSkater(skater)}
              >
                <Image source={{ uri: skater.avatar }} style={styles.webSkaterAvatar} />
                <View style={styles.webSkaterInfo}>
                  <Text style={styles.webSkaterName}>{skater.username}</Text>
                  <Text style={styles.webSkaterLevel}>{skater.skillLevel}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.webChallengeButton}
                  onPress={() => router.push(`/game/create?opponent=${skater.id}`)}
                >
                  <Text style={styles.webChallengeButtonText}>Challenge</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && MapView && Marker && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {/* Current Location */}
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You are here"
            />

            {/* Skater Markers */}
            {MOCK_SKATERS.map((skater) => (
              <Marker
                key={skater.id}
                coordinate={skater.location}
                onPress={() => setSelectedSkater(skater)}>
                <Image
                  source={{ uri: skater.avatar }}
                  style={styles.skaterMarker}
                />
              </Marker>
            ))}
          </MapView>

          {/* Active Toggle */}
          <TouchableOpacity
            style={[
              styles.activeToggle,
              isActive && styles.activeToggleOn,
            ]}
            onPress={() => setIsActive(!isActive)}>
            <Text style={styles.activeToggleText}>
              {isActive ? 'Active' : 'Inactive'}
            </Text>
          </TouchableOpacity>

          {/* Start Game Button */}
          <TouchableOpacity
            style={styles.startGameButton}
            onPress={handleStartGame}>
            <Plus color="#fff" size={24} />
          </TouchableOpacity>

          {/* Skater Profile Popup */}
          {selectedSkater && (
            <BlurView intensity={80} style={styles.popup}>
              <View style={styles.popupContent}>
                <Image
                  source={{ uri: selectedSkater.avatar }}
                  style={styles.popupAvatar}
                />
                <Text style={styles.popupUsername}>{selectedSkater.username}</Text>
                <Text style={styles.popupSkillLevel}>{selectedSkater.skillLevel}</Text>
                
                <View style={styles.popupButtons}>
                  <TouchableOpacity
                    style={styles.popupButton}
                    onPress={() => router.push(`/profile/${selectedSkater.id}`)}>
                    <Text style={styles.popupButtonText}>View Profile</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.popupButton, styles.popupButtonPrimary]}
                    onPress={() => router.push(`/game/create?opponent=${selectedSkater.id}`)}>
                    <Text style={[styles.popupButtonText, styles.popupButtonTextPrimary]}>
                      Challenge
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.popupClose}
                  onPress={() => setSelectedSkater(null)}>
                  <Text style={styles.popupCloseText}>Close</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  webMapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  webSpotsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  webSkatersList: {
    width: '100%',
    maxWidth: 600,
    gap: 15,
  },
  webSkaterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  webSkaterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  webSkaterInfo: {
    flex: 1,
    marginLeft: 15,
  },
  webSkaterName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  webSkaterLevel: {
    color: '#00ff00',
    fontWeight: '500',
  },
  webChallengeButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  webChallengeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  activeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeToggleOn: {
    backgroundColor: '#00ff00',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: '600',
  },
  startGameButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  skaterMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  popup: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  popupContent: {
    alignItems: 'center',
    padding: 20,
  },
  popupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  popupUsername: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  popupSkillLevel: {
    fontSize: 16,
    color: '#00ff00',
    marginBottom: 20,
  },
  popupButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  popupButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  popupButtonPrimary: {
    backgroundColor: '#000',
  },
  popupButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  popupButtonTextPrimary: {
    color: '#fff',
  },
  popupClose: {
    marginTop: 10,
  },
  popupCloseText: {
    color: '#666',
  },
});