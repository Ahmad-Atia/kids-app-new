import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EventService from '../services/EventService';
import { useApp } from '../context/AppContext';

const CreateEventScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    isPublic: true
  });

  const { user } = useApp();

  const formatDateForAPI = (dateString) => {
    try {
      // Try to parse the date and convert to ISO format
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date.toISOString();
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString; // Return original if formatting fails
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter an event name');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter an event description');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter an event location');
      return false;
    }
    if (!formData.date.trim()) {
      Alert.alert('Error', 'Please enter an event date');
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to create events');
      return;
    }

    if (!validateForm()) return;

    setLoading(true);

    try {
      const eventData = {
        name: formData.name,
        description: formData.description,
        date: formatDateForAPI(formData.date),
        location: formData.location,
        creatorID: user.id,
        isPublic: formData.isPublic,
        status: 'PLANNED'
      };

      console.log('[DEBUG] About to create event with data:', JSON.stringify(eventData, null, 2));
      console.log('[DEBUG] Date format check:', {
        originalDate: formData.date,
        isValidDate: !isNaN(new Date(formData.date).getTime()),
        parsedDate: new Date(formData.date).toISOString()
      });

      console.log(user);

      const result = await EventService.createEvent(eventData);

      if (result.success) {
        Alert.alert('Success', 'Event created successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to create event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Create New Event</Text>
          <Text style={styles.subtitle}>Share your event with the community</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Event Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event name"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your event"
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date & Time *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD HH:MM (e.g., 2025-08-15 10:00)"
              value={formData.date}
              onChangeText={(value) => handleInputChange('date', value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event location"
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Event Visibility</Text>
            <View style={styles.switchContainer}>
              <TouchableOpacity
                style={[
                  styles.switchOption,
                  formData.isPublic && styles.switchOptionActive
                ]}
                onPress={() => handleInputChange('isPublic', true)}
              >
                <Ionicons 
                  name="globe-outline" 
                  size={20} 
                  color={formData.isPublic ? '#fff' : '#007AFF'} 
                />
                <Text style={[
                  styles.switchText,
                  formData.isPublic && styles.switchTextActive
                ]}>
                  Public
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.switchOption,
                  !formData.isPublic && styles.switchOptionActive
                ]}
                onPress={() => handleInputChange('isPublic', false)}
              >
                <Ionicons 
                  name="lock-closed-outline" 
                  size={20} 
                  color={!formData.isPublic ? '#fff' : '#007AFF'} 
                />
                <Text style={[
                  styles.switchText,
                  !formData.isPublic && styles.switchTextActive
                ]}>
                  Private
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreateEvent}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.createButtonText}>Creating...</Text>
            ) : (
              <>
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.createButtonText}>Create Event</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
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
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchGroup: {
    marginBottom: 30,
  },
  switchContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  switchOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  switchOptionActive: {
    backgroundColor: '#007AFF',
  },
  switchText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  switchTextActive: {
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CreateEventScreen;
