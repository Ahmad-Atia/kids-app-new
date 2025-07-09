import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import EventService from '../services/EventService';
import WebSocketService from '../services/WebSocketService';
import { colors, typography, spacing, borderRadius, shadows, cardStyles, buttonStyles } from '../config/Theme';

const HomeScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user } = useApp();

  useEffect(() => {
    loadEvents();
    
    // Listen for new notifications to update the count
    const handleNewNotification = () => {
      const notifications = WebSocketService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    };

    // Initial count
    handleNewNotification();

    // Add listener
    WebSocketService.addNotificationListener(handleNewNotification);

    // Cleanup
    return () => {
      WebSocketService.removeNotificationListener(handleNewNotification);
    };
  }, []);

  const loadEvents = async () => {
    try {
      const result = await EventService.getAllEvents();
      if (result.success) {
        // Filter out any null/undefined events and show only first 5 events on home screen
        const validEvents = result.events.filter(event => event != null).slice(0, 5);
        console.log('[DEBUG] HomeScreen valid events:', validEvents.length);
        setEvents(validEvents);
      } else {
        console.error('[ERROR] HomeScreen failed to load events:', result.error);
        Alert.alert('Error', result.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('[ERROR] HomeScreen exception loading events:', error);
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEvents();
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  const renderEventCard = (event) => {
    if (!event) return null;
    
    const formattedEvent = EventService.formatEventForDisplay(event);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() => handleEventPress(event)}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.name || event.title || 'Untitled Event'}</Text>
          <Text style={styles.eventDate}>{formattedEvent.formattedDate}</Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description || 'No description available'}
        </Text>
        <View style={styles.eventFooter}>
          <View style={styles.eventInfo}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.eventLocation}>{event.location || 'Location TBD'}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.participantCount}>
              {formattedEvent.participantCount} participants
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
    

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Events')}
        >
          <Ionicons name="list" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Browse Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Calendar')}
        >
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Calendar View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Community')}
        >
          <Ionicons name="people" size={24} color={colors.primary} />
          <Text style={styles.actionText}>Community</Text>
        </TouchableOpacity>
      </View>

     
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Events')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events available</Text>
            <Text style={styles.emptySubtext}>Check back later for new events!</Text>
          </View>
        ) : (
          events.map(renderEventCard)
        )}
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
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    paddingTop: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logoSection: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  notificationButton: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  eventCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  participantCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HomeScreen;
