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
import { EventService } from '../services/EventService';

export default function FeedbackScreen({ route, navigation }) {
  const { event } = route.params;
  const { user } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await EventService.submitFeedback(event.id, {
        rating,
        comment,
        userId: user.id,
      });
      
      Alert.alert('Success', 'Feedback submitted successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
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
          <Text style={styles.eventTitle}>{event.title}</Text>
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
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  ratingSection: {
    marginBottom: 30,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  star: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  activeStar: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  inactiveStar: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  starText: {
    fontSize: 24,
    color: '#333',
  },
  commentSection: {
    marginBottom: 30,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  commentInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
