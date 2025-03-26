import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Trophy, Timer, Users } from 'lucide-react-native';

type Challenge = {
  id: string;
  type: 'SKATE' | 'Best Trick';
  challenger: {
    id: string;
    username: string;
    avatar: string;
  };
  opponent: {
    id: string;
    username: string;
    avatar: string;
  };
  status: 'active' | 'pending' | 'completed';
  wager: number;
  location: string;
  timeLeft?: string;
  winner?: string;
};

const MOCK_CHALLENGES: Challenge[] = [];

export default function Challenges() {
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'completed'>('active');
  const router = useRouter();

  const filteredChallenges = MOCK_CHALLENGES.filter(
    (challenge) => challenge.status === activeTab
  );

  const renderChallenge = ({ item }: { item: Challenge }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => router.push(`/game/${item.id}`)}>
      <View style={styles.challengeHeader}>
        <View style={styles.challengeType}>
          <Trophy size={16} color="#FFD700" />
          <Text style={styles.challengeTypeText}>{item.type}</Text>
        </View>
        {item.wager > 0 && (
          <Text style={styles.wager}>{item.wager} SKATE</Text>
        )}
      </View>

      <View style={styles.players}>
        <View style={styles.player}>
          <Image source={{ uri: item.challenger.avatar }} style={styles.playerAvatar} />
          <Text style={styles.playerName}>{item.challenger.username}</Text>
          {item.winner === item.challenger.username && (
            <Text style={styles.winnerTag}>Winner</Text>
          )}
        </View>
        <Text style={styles.vs}>VS</Text>
        <View style={styles.player}>
          <Image source={{ uri: item.opponent.avatar }} style={styles.playerAvatar} />
          <Text style={styles.playerName}>{item.opponent.username}</Text>
          {item.winner === item.opponent.username && (
            <Text style={styles.winnerTag}>Winner</Text>
          )}
        </View>
      </View>

      <View style={styles.challengeFooter}>
        <View style={styles.location}>
          <Users size={16} color="#666" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        {item.timeLeft && (
          <View style={styles.timeLeft}>
            <Timer size={16} color="#666" />
            <Text style={styles.timeLeftText}>{item.timeLeft}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/game/create')}>
          <Text style={styles.createButtonText}>Create Challenge</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {(['active', 'pending', 'completed'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredChallenges.length === 0 ? (
        <View style={styles.emptyState}>
          <Trophy size={48} color="#666" />
          <Text style={styles.emptyStateTitle}>No {activeTab} challenges</Text>
          <Text style={styles.emptyStateText}>
            Start a new game of SKATE by tapping the plus button on the map or create a challenge here!
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => router.push('/game/create')}>
            <Text style={styles.emptyStateButtonText}>Create Challenge</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredChallenges}
          renderItem={renderChallenge}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.challengesList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#000',
  },
  tabText: {
    color: '#000',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  challengesList: {
    gap: 15,
  },
  challengeCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    gap: 15,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengeType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  challengeTypeText: {
    color: '#000',
    fontWeight: '600',
  },
  wager: {
    color: '#FFD700',
    fontWeight: '600',
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  player: {
    alignItems: 'center',
    gap: 5,
  },
  playerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  playerName: {
    color: '#000',
    fontWeight: '500',
  },
  vs: {
    color: '#666',
    fontWeight: '600',
  },
  winnerTag: {
    color: '#00ff00',
    fontSize: 12,
    fontWeight: '600',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: '#666',
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeLeftText: {
    color: '#666',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  emptyStateText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: '#000',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});