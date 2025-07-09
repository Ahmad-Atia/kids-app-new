import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  SafeAreaView,
  FlatList,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventService from '../services/EventService';
import { useApp } from '../context/AppContext';
import { colors, typography, createTextStyle } from '../config/Theme';

const { width } = Dimensions.get('window');

const CalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const { user } = useApp();

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEventsForSelectedDate();
  }, [selectedDate, events]);

  const loadEvents = async () => {
    try {
      const result = await EventService.getAllEvents();
      if (result.success) {
        const validEvents = result.events.filter(event => event != null);
        setEvents(validEvents);
        console.log('[DEBUG] CalendarScreen loaded events:', validEvents.length);
      } else {
        console.error('[ERROR] CalendarScreen failed to load events:', result.error);
        Alert.alert('Error', result.error || 'Failed to load events');
      }
    } catch (error) {
      console.error('[ERROR] CalendarScreen exception loading events:', error);
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

  const filterEventsForSelectedDate = () => {
    const selectedDateString = selectedDate.toDateString();
    const filtered = events.filter(event => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDateString;
    });
    setSelectedDateEvents(filtered);
  };

  const handleEventPress = (event) => {
    navigation.navigate('EventDetails', { eventId: event.id });
  };

  // Generate calendar grid
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    const endDate = new Date(lastDay);
    
    // Adjust to start from Monday (or Sunday based on preference)
    const startDay = firstDay.getDay();
    startDate.setDate(startDate.getDate() - startDay);
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks × 7 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      const dayEvents = events.filter(event => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === current.toDateString();
      });
      
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === new Date().toDateString(),
        isSelected: current.toDateString() === selectedDate.toDateString(),
        events: dayEvents,
        hasEvents: dayEvents.length > 0
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const renderCalendarDay = ({ item }) => {
    const dayNumber = item.date.getDate();
    
    return (
      <TouchableOpacity
        style={[
          styles.dayContainer,
          !item.isCurrentMonth && styles.dayOutOfMonth,
          item.isToday && styles.dayToday,
          item.isSelected && styles.daySelected,
          item.hasEvents && styles.dayWithEvents
        ]}
        onPress={() => setSelectedDate(item.date)}
      >
        <Text style={[
          styles.dayText,
          !item.isCurrentMonth && styles.dayTextOutOfMonth,
          item.isToday && styles.dayTextToday,
          item.isSelected && styles.dayTextSelected
        ]}>
          {dayNumber}
        </Text>
        {item.hasEvents && (
          <View style={styles.eventDot}>
            <Text style={styles.eventCount}>{item.events.length}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
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
          <Text style={styles.eventTime}>{formattedEvent.formattedTime}</Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {event.description || 'No description available'}
        </Text>
        <View style={styles.eventFooter}>
          <View style={styles.eventInfo}>
            <Ionicons name="location-outline" size={16} color={colors.textDark + '80'} />
            <Text style={styles.eventLocation}>{event.location || 'Location TBD'}</Text>
          </View>
          <View style={styles.eventInfo}>
            <Ionicons name="people-outline" size={16} color={colors.textDark + '80'} />
            <Text style={styles.participantCount}>
              {formattedEvent.participantCount} participants
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading calendar...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(-1)}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.monthYear}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigateMonth(1)}
          >
            <Ionicons name="chevron-forward" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekDaysHeader}>
          {weekDays.map(day => (
            <View key={day} style={styles.weekDayContainer}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          <FlatList
            data={generateCalendarDays()}
            renderItem={renderCalendarDay}
            keyExtractor={(item, index) => index.toString()}
            numColumns={7}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Selected Date Events */}
        <View style={styles.selectedDateSection}>
          <Text style={styles.selectedDateTitle}>
            Events on {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
          
          {selectedDateEvents.length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Ionicons name="calendar-outline" size={48} color={colors.textDark + '50'} />
              <Text style={styles.noEventsText}>No events on this date</Text>
              <Text style={styles.noEventsSubtext}>Select another date to view events</Text>
            </View>
          ) : (
            <View style={styles.eventsContainer}>
              {selectedDateEvents.map(renderEventCard)}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textDark,
    marginTop: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '20',
  },
  navButton: {
    padding: 10,
  },
  monthYear: {
    ...typography.headline,
    color: colors.textDark,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary + '20',
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    ...typography.caption,
    color: colors.textDark,
    fontWeight: '600',
  },
  calendarGrid: {
    backgroundColor: '#fff',
    paddingHorizontal: 5,
  },
  dayContainer: {
    width: width / 7,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayOutOfMonth: {
    opacity: 0.3,
  },
  dayToday: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  daySelected: {
    backgroundColor: colors.success,
    borderRadius: 25,
  },
  dayWithEvents: {
    backgroundColor: colors.skin + '40',
    borderRadius: 25,
  },
  dayText: {
    ...typography.body,
    color: colors.textDark,
  },
  dayTextOutOfMonth: {
    color: colors.textDark + '50',
  },
  dayTextToday: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  eventDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.accentRed,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  selectedDateSection: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: colors.textDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDateTitle: {
    ...typography.subheadline,
    color: colors.textDark,
    marginBottom: 15,
  },
  noEventsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noEventsText: {
    ...typography.body,
    color: colors.textDark,
    marginTop: 10,
    marginBottom: 5,
  },
  noEventsSubtext: {
    ...typography.caption,
    color: colors.textDark + '80',
    textAlign: 'center',
  },
  eventsContainer: {
    gap: 10,
  },
  eventCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    ...typography.subheadline,
    color: colors.textDark,
    flex: 1,
    marginRight: 10,
    fontSize: 16,
  },
  eventTime: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  eventDescription: {
    ...typography.body,
    color: colors.textDark + '90',
    marginBottom: 10,
    fontSize: 14,
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
    ...typography.caption,
    color: colors.textDark + '80',
    marginLeft: 4,
  },
  participantCount: {
    ...typography.caption,
    color: colors.textDark + '80',
    marginLeft: 4,
  },
});

export default CalendarScreen;
