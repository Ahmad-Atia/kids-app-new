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
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWebSocket } from '../hooks/useWebSocket';
import Config from '../config/Config';
import WebSocketService from '../services/WebSocketService';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  // Removed WebSocket hook since we only want to display MQTT messages

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Load initial notifications
    loadNotifications();

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
    };

    WebSocketService.addNotificationListener(handleNewNotification);

    // Cleanup
    return () => {
      WebSocketService.removeNotificationListener(handleNewNotification);
    };
  }, []);

  const loadNotifications = () => {
    // Get real notifications from WebSocket service (MQTT messages only)
    const realNotifications = WebSocketService.getNotifications();
    setNotifications(realNotifications);
    setRefreshing(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadNotifications();
    }, 1000);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (id) => {
    Alert.alert(
      'Benachrichtigung löschen',
      'Möchten Sie diese Benachrichtigung wirklich löschen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Löschen', 
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(n => n.id !== id));
          }
        }
      ]
    );
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'event': return '#4CAF50';
      case 'community': return '#2196F3';
      case 'reminder': return '#FF9800';
      case 'mqtt': return '#9C27B0';
      case 'info': return '#607D8B';
      case 'warning': return '#F44336';
      default: return '#607D8B';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000); // seconds

    if (diff < 60) return 'gerade eben';
    if (diff < 3600) return `vor ${Math.floor(diff / 60)} Min`;
    if (diff < 86400) return `vor ${Math.floor(diff / 3600)} Std`;
    return timestamp.toLocaleDateString('de-DE');
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => deleteNotification(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconBackground, { backgroundColor: getNotificationColor(item.type) }]}>
            <Ionicons name={item.icon} size={20} color="#FFF" />
          </View>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          {item.subtitle && (
            <Text style={styles.notificationSubtitle}>
              📅 {item.subtitle}
            </Text>
          )}
          <Text style={styles.notificationMessage} numberOfLines={2}>
            📍 {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Ionicons name="close" size={16} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Benachrichtigungen</Text>
          </View>
          
          {unreadCount > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.unreadCount}>
                {unreadCount} neue Nachrichten
              </Text>
              <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
                <Text style={styles.markAllText}>Alle als gelesen markieren</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Debug: Test Event Message Button */}
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={() => {
              const testMessage = "MQTT_EVENT|events/created|EVENT_CREATED|ab9e689c-70d3-4936-b310-d7ee490aa86c|Summer Coding Workshop 2|2025-08-15T10:00|TechHub Berlin, Hauptstraße 123|false|1752062217678|1752062217681";
              WebSocketService.handleMessage(testMessage);
            }}
          >
            <Text style={styles.testButtonText}>🧪 Test Event Message</Text>
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={64} color="#DDD" />
            <Text style={styles.emptyTitle}>Keine Benachrichtigungen</Text>
            <Text style={styles.emptyMessage}>
              Sie erhalten hier Live-Updates über Events und Aktivitäten vom MQTT-Broker
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotification}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 16,
  },
  markAllText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  testButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#34C759',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  testButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  notificationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
  },
  iconBackground: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default NotificationScreen;
