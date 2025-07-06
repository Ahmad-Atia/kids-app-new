import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';

export default function EventCard({ event, onPress, showJoinButton = false, onJoin }) {
  // Safety check for undefined event
  if (!event) {
    console.warn('EventCard received undefined event prop');
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Date TBD';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      return 'Time TBD';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return '#007AFF';
      case 'ongoing':
        return '#34C759';
      case 'completed':
        return '#8E8E93';
      case 'cancelled':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const isEventFull = () => {
    return event.maxParticipants && event.participants?.length >= event.maxParticipants;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {event.name || event.title}
        </Text>
        {event.status && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(event.status) }]}>
            <Text style={styles.statusText}>{event.status}</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {event.description || 'No description available'}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📅</Text>
          <Text style={styles.detailText}>
            {formatDate(event.date)} at {formatTime(event.date)}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>📍</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {event.location || 'Location TBD'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>👥</Text>
          <Text style={styles.detailText}>
            {event.participants?.length || 0}
            {event.maxParticipants && ` / ${event.maxParticipants}`} participants
          </Text>
        </View>

        {event.community && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🏘️</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {event.community.name}
            </Text>
          </View>
        )}
      </View>

      {showJoinButton && onJoin && (
        <TouchableOpacity
          style={[
            styles.joinButton,
            isEventFull() && styles.joinButtonDisabled
          ]}
          onPress={() => onJoin(event)}
          disabled={isEventFull()}
        >
          <Text style={styles.joinButtonText}>
            {isEventFull() ? 'Event Full' : 'Join Event'}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  details: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: '#ccc',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
