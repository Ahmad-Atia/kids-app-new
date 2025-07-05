import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LoadingSpinner({ 
  color = '#007AFF', 
  text = 'Loading...', 
  style,
  overlay = false 
}) {
  const containerStyle = [
    styles.container,
    overlay && styles.overlay,
    style
  ];

  return (
    <View style={containerStyle}>
      <Text style={[styles.text, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});
