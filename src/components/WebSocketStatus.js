import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

/**
 * Simple WebSocket connection status indicator
 */
const WebSocketStatus = ({ showLabel = true, onPress = null }) => {
  const { webSocketConnected } = useApp();

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const StatusComponent = onPress ? TouchableOpacity : View;

  return (
    <StatusComponent 
      style={[styles.container, onPress && styles.touchable]} 
      onPress={handlePress}
    >
      <View style={[styles.indicator, { backgroundColor: webSocketConnected ? '#4CAF50' : '#F44336' }]} />
      <Ionicons 
        name={webSocketConnected ? 'wifi' : 'wifi-outline'} 
        size={16} 
        color={webSocketConnected ? '#4CAF50' : '#F44336'} 
      />
      {showLabel && (
        <Text style={[styles.text, { color: webSocketConnected ? '#4CAF50' : '#F44336' }]}>
          {webSocketConnected ? 'Connected' : 'Offline'}
        </Text>
      )}
    </StatusComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  touchable: {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default WebSocketStatus;
