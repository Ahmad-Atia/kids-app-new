import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventService from '../services/EventService';
import { useApp } from '../context/AppContext';
import { styles } from '../styles/EventsScreen.style';

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useApp();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search query
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => {
        if (!event) return false;
        
        const name = event.name || event.title || '';
        const description = event.description || '';
        const location = event.location || '';
        
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               location.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const loadEvents = async () => {
    try {
      const result = await EventService.getAllEvents();
      console.log('[DEBUG] Events loaded:', result);
      if (result.success) {
        // Filter out any null/undefined events
        const validEvents = result.events.filter(event => event != null);
        console.log('[DEBUG] Valid events:', validEvents.length, 'out of', result.events.length);
        setEvents(validEvents);
        setFilteredEvents(validEvents);
      } else {
        console.error('[ERROR] Failed to load events:', result.error);
        Alert.alert('Error', result.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('[ERROR] Exception loading events:', error);
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

  const handleParticipate = async (event) => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to participate in events');
      return;
    }

    try {
      const result = await EventService.participateInEvent(event.id, user.id);
      if (result.success) {
        Alert.alert('Success', 'Successfully joined the event!');
        loadEvents(); // Refresh events
      } else {
        Alert.alert('Error', result.error || 'Failed to join event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join event');
    }
  };

  const renderEventCard = (event) => {
    if (!event) return null;
    
    const formattedEvent = EventService.formatEventForDisplay(event);
    const isParticipating = user && !user.guest && EventService.isUserParticipating(event, user.id);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() => handleEventPress(event)}
      >
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.name || event.title || 'Untitled Event'}</Text>
          <View style={styles.eventStatus}>
            <Text style={[styles.statusText, { color: event.status === 'PLANNED' ? '#007AFF' : '#28a745' }]}>
              {event.status || 'Unknown'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description || 'No description available'}
        </Text>
        
        <View style={styles.eventDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formattedEvent.formattedDate} at {formattedEvent.formattedTime}
            </Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{event.location || 'Location TBD'}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {formattedEvent.participantCount} participants
            </Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleEventPress(event)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          
          {!isParticipating && (
            <TouchableOpacity
              style={styles.participateButton}
              onPress={() => handleParticipate(event)}
            >
              <Text style={styles.participateButtonText}>Join</Text>
            </TouchableOpacity>
          )}
          
          {isParticipating && (
            <View style={styles.participatingBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.participatingText}>Joined</Text>
            </View>
          )}
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No events found' : 'No events available'}
            </Text>
            {!searchQuery && (
              <Text style={styles.emptySubtext}>
                New events will appear here when they're created by administrators.
              </Text>
            )}
          </View>
        ) : (
          filteredEvents.map(renderEventCard)
        )}
      </ScrollView>
    </View>
  );
};

export default EventsScreen;
