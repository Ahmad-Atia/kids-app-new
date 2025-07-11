import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AppContext } from '../context/AppContext';
import EventService from '../services/EventService';
import { styles } from '../styles/FeedbackScreen.style';

export default function FeedbackScreen({ route, navigation }) {
  const { event } = route.params;
  const { user } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('[DEBUG] FeedbackScreen event:', event);
  console.log('[DEBUG] FeedbackScreen event type:', typeof event);
  console.log('[DEBUG] FeedbackScreen event properties:', event ? Object.keys(event) : 'null');

  // Safety check for event object
  if (!event) {
    console.error('[ERROR] FeedbackScreen: No event provided');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Error: Event not found</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const result = await EventService.addFeedback(event.id, {
        rating,
        comment,
        content: comment, // Add content property as well
        userID: user.id,  // Change to userID (capital D)
      });
      
      if (result.success) {
        Alert.alert('Success', 'Feedback submitted successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.star,
            rating >= i ? styles.activeStar : styles.inactiveStar
          ]}
          onPress={() => setRating(i)}
        >
          <Text style={styles.starText}>★</Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Rate Your Experience</Text>
          <Text style={styles.eventTitle}>{event.name || event.title || 'Event'}</Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingLabel}>How was the event?</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
        </View>

        <View style={styles.commentSection}>
          <Text style={styles.commentLabel}>Tell us more (optional)</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            placeholder="Share your thoughts about the event..."
            placeholderTextColor="#999"
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmitFeedback}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
