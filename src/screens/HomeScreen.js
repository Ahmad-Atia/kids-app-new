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
import { styles } from '../styles/HomeScreen.style';

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

export default HomeScreen;
