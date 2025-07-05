import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapScreen = ({ route }) => {
  const { event } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Map</Text>
      <Text style={styles.subtitle}>
        {event ? `Location: ${event.location}` : 'No event location provided'}
      </Text>
      <Text style={styles.comingSoon}>Map integration coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 18,
    color: '#007AFF',
    fontStyle: 'italic',
  },
});

export default MapScreen;
