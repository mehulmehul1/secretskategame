import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Users } from 'lucide-react-native';

const MOCK_SESSIONS = [
  {
    id: '1',
    title: 'Downtown Session',
    participants: 5,
    location: 'Central Park',
    time: '2:00 PM',
  },
  {
    id: '2',
    title: 'Skate Park Meetup',
    participants: 8,
    location: 'Venice Beach',
    time: '4:30 PM',
  },
];

export default function Sessions() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Sessions</Text>
      <FlatList
        data={MOCK_SESSIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{item.title}</Text>
              <View style={styles.participantsContainer}>
                <Users size={16} color="#666" />
                <Text style={styles.participantsText}>{item.participants}</Text>
              </View>
            </View>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  sessionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantsText: {
    color: '#666',
    marginLeft: 4,
  },
  locationText: {
    color: '#00ff00',
    marginBottom: 4,
  },
  timeText: {
    color: '#666',
  },
});