import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventService from '../services/EventService';
import { useApp } from '../context/AppContext';

const EventDetailsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useApp();

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      const result = await EventService.getEvent(eventId);
      if (result.success) {
        setEvent(result.event);
      } else {
        Alert.alert('Error', result.error || 'Failed to load event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async () => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to participate in events');
      return;
    }

    try {
      const result = await EventService.participateInEvent(eventId, user.id);
      if (result.success) {
        Alert.alert('Success', 'Successfully joined the event!');
        loadEvent(); // Refresh event data
      } else {
        Alert.alert('Error', result.error || 'Failed to join event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join event');
    }
  };

  const handleRemoveParticipation = async () => {
    if (!user || user.guest) return;

    try {
      const result = await EventService.removeParticipation(eventId, user.id);
      if (result.success) {
        Alert.alert('Success', 'Successfully left the event!');
        loadEvent(); // Refresh event data
      } else {
        Alert.alert('Error', result.error || 'Failed to leave event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to leave event');
    }
  };

  const handleShare = async () => {
    try {
      const eventName = event.name || event.title || 'Untitled Event';
      const eventDescription = event.description || 'No description available';
      const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD';
      const eventLocation = event.location || 'Location TBD';
      
      const result = await Share.share({
        message: `Check out this event: ${eventName}\n\n${eventDescription}\n\nDate: ${eventDate}\nLocation: ${eventLocation}`,
        title: eventName,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share event');
    }
  };

  const handleShowOnMap = () => {
    navigation.navigate('Map', { event });
  };

  const handleAddFeedback = () => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to add feedback');
      return;
    }
    navigation.navigate('Feedback', { event });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ff4444" />
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const formattedEvent = EventService.formatEventForDisplay(event);
  const isParticipating = user && !user.guest && EventService.isUserParticipating(event, user.id);
  const isCreator = user && !user.guest && event.creatorID === user.id;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShowOnMap}>
            <Ionicons name="location-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.title}>{event.name || event.title || 'Untitled Event'}</Text>
        
        <View style={styles.statusContainer}>
          <Text style={[styles.status, { color: event.status === 'PLANNED' ? '#007AFF' : '#28a745' }]}>
            {event.status || 'Unknown'}
          </Text>
          {event.isPublic && (
            <View style={styles.publicBadge}>
              <Ionicons name="globe-outline" size={16} color="#28a745" />
              <Text style={styles.publicText}>Public</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{event.description || 'No description available'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Event Details</Text>
          
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date & Time</Text>
              <Text style={styles.detailValue}>
                {formattedEvent.formattedDate} at {formattedEvent.formattedTime}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{event.location || 'Location TBD'}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={20} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Participants</Text>
              <Text style={styles.detailValue}>
                {formattedEvent.participantCount} people joined
              </Text>
            </View>
          </View>
        </View>

        {event.feedbacks && event.feedbacks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Feedback</Text>
            {event.feedbacks.slice(0, 3).map((feedback, index) => (
              <View key={index} style={styles.feedbackItem}>
                <Text style={styles.feedbackText}>{feedback.comment}</Text>
                <Text style={styles.feedbackRating}>
                  {'★'.repeat(feedback.rating)}{'☆'.repeat(5 - feedback.rating)}
                </Text>
              </View>
            ))}
            {event.feedbacks.length > 3 && (
              <Text style={styles.moreFeedback}>
                and {event.feedbacks.length - 3} more...
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {!isCreator && (
          <>
            {!isParticipating ? (
              <TouchableOpacity
                style={styles.participateButton}
                onPress={handleParticipate}
              >
                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                <Text style={styles.participateButtonText}>Join Event</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.leaveButton}
                onPress={handleRemoveParticipation}
              >
                <Ionicons name="remove-circle-outline" size={24} color="#fff" />
                <Text style={styles.leaveButtonText}>Leave Event</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        
        {isCreator && (
          <Text style={styles.creatorText}>You created this event</Text>
        )}

        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={handleAddFeedback}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#007AFF" />
          <Text style={styles.feedbackButtonText}>Add Feedback</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 10,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  actionButton: {
    marginLeft: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
  },
  publicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  publicText: {
    color: '#28a745',
    marginLeft: 4,
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  detailContent: {
    flex: 1,
    marginLeft: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  feedbackItem: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  feedbackText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  feedbackRating: {
    fontSize: 16,
    color: '#ffa500',
  },
  moreFeedback: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  actions: {
    padding: 20,
  },
  participateButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  participateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  leaveButton: {
    backgroundColor: '#ff4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  creatorText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  feedbackButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  feedbackButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default EventDetailsScreen;
