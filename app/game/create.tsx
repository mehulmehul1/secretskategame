import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Trophy, Timer, Users, ArrowLeft } from 'lucide-react-native';

const MOCK_SKATERS = [
  {
    id: '1',
    username: 'TonyHawk',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100',
    skillLevel: 'Legend',
  },
  {
    id: '2',
    username: 'StreetKing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    skillLevel: 'Pro',
  },
  {
    id: '3',
    username: 'FlipMaster',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100',
    skillLevel: 'Advanced',
  },
];

export default function CreateGame() {
  const { opponent } = useLocalSearchParams();
  const router = useRouter();
  const [selectedOpponent, setSelectedOpponent] = useState(
    opponent ? MOCK_SKATERS.find(s => s.id === opponent) : null
  );
  const [gameType, setGameType] = useState<'SKATE' | 'Best Trick'>('SKATE');
  const [wager, setWager] = useState('0');
  const [timeLimit, setTimeLimit] = useState('60'); // seconds

  const handleCreate = () => {
    if (!selectedOpponent) return;

    // Here you would typically create the game in your backend
    console.log({
      type: gameType,
      opponent: selectedOpponent.id,
      wager: parseInt(wager),
      timeLimit: parseInt(timeLimit),
    });

    // Navigate to the challenges tab
    router.push('/challenges');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>New Challenge</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Type</Text>
        <View style={styles.gameTypes}>
          <TouchableOpacity
            style={[styles.gameType, gameType === 'SKATE' && styles.gameTypeSelected]}
            onPress={() => setGameType('SKATE')}>
            <Trophy size={24} color={gameType === 'SKATE' ? '#fff' : '#000'} />
            <Text style={[styles.gameTypeText, gameType === 'SKATE' && styles.gameTypeTextSelected]}>
              SKATE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.gameType, gameType === 'Best Trick' && styles.gameTypeSelected]}
            onPress={() => setGameType('Best Trick')}>
            <Trophy size={24} color={gameType === 'Best Trick' ? '#fff' : '#000'} />
            <Text style={[styles.gameTypeText, gameType === 'Best Trick' && styles.gameTypeTextSelected]}>
              Best Trick
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opponent</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opponentsList}>
          {MOCK_SKATERS.map((skater) => (
            <TouchableOpacity
              key={skater.id}
              style={[
                styles.opponentCard,
                selectedOpponent?.id === skater.id && styles.opponentCardSelected,
              ]}
              onPress={() => setSelectedOpponent(skater)}>
              <Image source={{ uri: skater.avatar }} style={styles.opponentAvatar} />
              <Text style={styles.opponentName}>{skater.username}</Text>
              <Text style={styles.opponentLevel}>{skater.skillLevel}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Wager (SKATE Tokens)</Text>
          <TextInput
            style={styles.input}
            value={wager}
            onChangeText={setWager}
            keyboardType="numeric"
            placeholder="Enter wager amount"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time Limit (seconds)</Text>
          <TextInput
            style={styles.input}
            value={timeLimit}
            onChangeText={setTimeLimit}
            keyboardType="numeric"
            placeholder="Enter time limit"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.createButton, !selectedOpponent && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={!selectedOpponent}>
        <Text style={styles.createButtonText}>Create Challenge</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  gameTypes: {
    flexDirection: 'row',
    gap: 15,
  },
  gameType: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    gap: 10,
  },
  gameTypeSelected: {
    backgroundColor: '#000',
  },
  gameTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  gameTypeTextSelected: {
    color: '#fff',
  },
  opponentsList: {
    flexDirection: 'row',
  },
  opponentCard: {
    width: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginRight: 15,
  },
  opponentCardSelected: {
    backgroundColor: '#000',
  },
  opponentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  opponentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  opponentLevel: {
    fontSize: 14,
    color: '#00ff00',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#000',
    margin: 20,
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#666',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});