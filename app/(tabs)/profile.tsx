import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Settings, Award, Clock } from 'lucide-react-native';

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=200&auto=format' }}
          style={styles.avatar}
        />
        <Text style={styles.username}>StreetFlipKing</Text>
        <Text style={styles.rank}>Street Legend</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Award size={24} color="#FFD700" />
          <Text style={styles.statValue}>2,450</Text>
          <Text style={styles.statLabel}>SKATE</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={24} color="#00ff00" />
          <Text style={styles.statValue}>45</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.settingsButton}>
        <Settings size={24} color="#fff" />
        <Text style={styles.settingsText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginTop: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  rank: {
    fontSize: 16,
    color: '#00ff00',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    color: '#666',
    marginTop: 4,
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 12,
  },
  settingsText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 16,
  },
});