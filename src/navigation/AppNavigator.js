import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Import screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import EventsScreen from '../screens/EventsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MapScreen from '../screens/MapScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CommunityDetailsScreen from '../screens/CommunityDetailsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HelpScreen from '../screens/HelpScreen';
import NotificationScreen from '../screens/NotificationScreen';
import WebSocketService from '../services/WebSocketService';

// Import context
import { useApp } from '../context/AppContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom header for Home tab with notification icon
const HomeTabHeader = ({ navigation }) => {
  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    // Function to update notification count
    const updateCount = () => {
      const notifications = WebSocketService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    };

    // Initial count
    updateCount();

    // Add listener for new notifications
    WebSocketService.addNotificationListener(updateCount);

    // Cleanup
    return () => {
      WebSocketService.removeNotificationListener(updateCount);
    };
  }, []);

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>PartiZip Kids</Text>
      <TouchableOpacity 
        style={styles.headerNotificationButton}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Ionicons name="notifications" size={24} color="#fff" />
        {notificationCount > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

// Custom notification icon with badge
const NotificationTabIcon = ({ focused, color, size }) => {
  const [notificationCount, setNotificationCount] = React.useState(0);

  React.useEffect(() => {
    // Function to update notification count
    const updateCount = () => {
      const notifications = WebSocketService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      setNotificationCount(unreadCount);
    };

    // Initial count
    updateCount();

    // Add listener for new notifications
    WebSocketService.addNotificationListener(updateCount);

    // Cleanup
    return () => {
      WebSocketService.removeNotificationListener(updateCount);
    };
  }, []);

  const iconName = focused ? 'notifications' : 'notifications-outline';

  return (
    <View style={styles.tabIconContainer}>
      <Ionicons name={iconName} size={size} color={color} />
      {notificationCount > 0 && (
        <View style={styles.tabBadge}>
          <Text style={styles.tabBadgeText}>
            {notificationCount > 99 ? '99+' : notificationCount}
          </Text>
        </View>
      )}
    </View>
  );
};

// Main tab navigator for authenticated users
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Events') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Notifications') {
            return <NotificationTabIcon focused={focused} color={color} size={size} />;
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          headerTitle: () => <HomeTabHeader navigation={navigation} />,
          headerTitleAlign: 'left',
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
        })}
      />
      <Tab.Screen 
        name="Events" 
        component={EventsScreen} 
        options={{ title: 'Events' }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen} 
        options={{ title: 'Calendar' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen} 
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationScreen} 
        options={{ title: 'Nachrichten' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

// Main app navigator
const AppNavigator = () => {
  const { isAuthenticated, loading } = useApp();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
        {!isAuthenticated ? (
          // Auth flow
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // Main app flow
          <>
            <Stack.Screen
              name="Main"
              component={MainTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventDetails"
              component={EventDetailsScreen}
              options={{ title: 'Event Details' }}
            />
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ title: 'Event Map' }}
            />
            <Stack.Screen
              name="Feedback"
              component={FeedbackScreen}
              options={{ title: 'Feedback' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Edit Profile' }}
            />
            <Stack.Screen
              name="CommunityDetails"
              component={CommunityDetailsScreen}
              options={{ title: 'Community Details' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: 'Help & Support' }}
            />
          </>
        )}
      </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerNotificationButton: {
    padding: 5,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  headerBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -8,
    right: -12,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  tabBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
