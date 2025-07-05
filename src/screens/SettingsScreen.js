import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import { AuthService } from '../services/AuthService';

export default function SettingsScreen({ navigation }) {
  const { user, logout } = useContext(AppContext);
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
              });
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Info', 'Account deletion feature will be implemented soon');
          }
        }
      ]
    );
  };

  const settingsOptions = [
    {
      title: 'Account',
      items: [
        {
          label: 'Edit Profile',
          onPress: () => navigation.navigate('EditProfile'),
          showArrow: true,
        },
        {
          label: 'Change Password',
          onPress: () => Alert.alert('Info', 'Feature coming soon'),
          showArrow: true,
        },
      ]
    },
    {
      title: 'Preferences',
      items: [
        {
          label: 'Push Notifications',
          value: notifications,
          onToggle: setNotifications,
          isSwitch: true,
        },
        {
          label: 'Location Sharing',
          value: locationSharing,
          onToggle: setLocationSharing,
          isSwitch: true,
        },
        {
          label: 'Dark Mode',
          value: darkMode,
          onToggle: setDarkMode,
          isSwitch: true,
        },
      ]
    },
    {
      title: 'Support',
      items: [
        {
          label: 'Help & FAQ',
          onPress: () => navigation.navigate('Help'),
          showArrow: true,
        },
        {
          label: 'Contact Support',
          onPress: () => Alert.alert('Info', 'Feature coming soon'),
          showArrow: true,
        },
        {
          label: 'Report a Bug',
          onPress: () => Alert.alert('Info', 'Feature coming soon'),
          showArrow: true,
        },
      ]
    },
    {
      title: 'Legal',
      items: [
        {
          label: 'Privacy Policy',
          onPress: () => Alert.alert('Info', 'Feature coming soon'),
          showArrow: true,
        },
        {
          label: 'Terms of Service',
          onPress: () => Alert.alert('Info', 'Feature coming soon'),
          showArrow: true,
        },
      ]
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          {user && (
            <Text style={styles.userInfo}>
              {user.firstName} {user.lastName}
            </Text>
          )}
        </View>

        {settingsOptions.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={item.isSwitch}
              >
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.isSwitch ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#767577', true: '#007AFF' }}
                    thumbColor={item.value ? '#f5dd4b' : '#f4f3f4'}
                  />
                ) : item.showArrow ? (
                  <Text style={styles.arrow}>›</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {user && (
          <View style={styles.dangerZone}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.version}>Version 1.0.0</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userInfo: {
    fontSize: 16,
    color: '#666',
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
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 18,
    color: '#ccc',
  },
  dangerZone: {
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  version: {
    fontSize: 14,
    color: '#999',
  },
});
