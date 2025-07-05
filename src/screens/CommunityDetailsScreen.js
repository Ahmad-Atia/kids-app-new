import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { CommunityService } from '../services/CommunityService';
import { EventService } from '../services/EventService';

export default function CommunityDetailsScreen({ route, navigation }) {
  const { communityId } = route.params;
  const { user } = useContext(AppContext);
  const [community, setCommunity] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCommunityDetails();
  }, [communityId]);

  const loadCommunityDetails = async () => {
    try {
      const [communityData, communityEvents] = await Promise.all([
        CommunityService.getCommunity(communityId),
        EventService.getEventsByCommunity(communityId),
      ]);
      
      setCommunity(communityData);
      setEvents(communityEvents);
    } catch (error) {
      Alert.alert('Error', 'Failed to load community details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to join communities');
      return;
    }

    setActionLoading(true);
    try {
      const isMember = community.members?.some(member => member.id === user.id);
      
      if (isMember) {
        await CommunityService.leaveCommunity(communityId);
        Alert.alert('Success', 'Left community successfully');
      } else {
        await CommunityService.joinCommunity(communityId);
        Alert.alert('Success', 'Joined community successfully');
      }
      
      // Reload community details
      await loadCommunityDetails();
    } catch (error) {
      Alert.alert('Error', 'Failed to update community membership');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading community...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Community not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isMember = user && community.members?.some(member => member.id === user.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{community.name}</Text>
          <Text style={styles.description}>{community.description}</Text>
          <Text style={styles.memberCount}>
            {community.members?.length || 0} members
          </Text>
        </View>

        {user && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              isMember ? styles.leaveButton : styles.joinButton,
              actionLoading && styles.disabledButton
            ]}
            onPress={handleJoinLeave}
            disabled={actionLoading}
          >
            <Text style={styles.actionButtonText}>
              {actionLoading 
                ? 'Loading...' 
                : isMember 
                  ? 'Leave Community' 
                  : 'Join Community'
              }
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Community Events</Text>
          {events.length === 0 ? (
            <Text style={styles.noEventsText}>No events yet</Text>
          ) : (
            events.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => handleEventPress(event)}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>
                  {new Date(event.date).toLocaleDateString()}
                </Text>
                <Text style={styles.eventLocation}>{event.location}</Text>
                <Text style={styles.eventParticipants}>
                  {event.participants?.length || 0} participants
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Members</Text>
          {community.members?.length === 0 ? (
            <Text style={styles.noMembersText}>No members yet</Text>
          ) : (
            community.members?.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <Text style={styles.memberName}>
                  {member.firstName} {member.lastName}
                </Text>
                <Text style={styles.memberRole}>
                  {member.id === community.ownerId ? 'Owner' : 'Member'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  memberCount: {
    fontSize: 14,
    color: '#999',
  },
  actionButton: {
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  joinButton: {
    backgroundColor: '#007AFF',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  eventParticipants: {
    fontSize: 14,
    color: '#007AFF',
  },
  noMembersText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
  },
});
