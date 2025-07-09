import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import WebSocketService from '../services/WebSocketService';
import { useApp } from '../context/AppContext';
import Config from '../config/Config';

/**
 * Debugging component to diagnose WebSocket and MQTT issues
 * Add this to your app temporarily to debug connection problems
 */
const WebSocketDebugger = () => {
  const [connectionInfo, setConnectionInfo] = useState({});
  const [mqttStats, setMqttStats] = useState({});
  const { isAuthenticated, user, webSocketConnected } = useApp();

  useEffect(() => {
    updateConnectionInfo();
    const interval = setInterval(updateConnectionInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateConnectionInfo = () => {
    const connected = WebSocketService.getConnectionStatus();
    const stats = WebSocketService.getMQTTStats();
    
    setConnectionInfo({
      connected,
      url: Config.getWebSocketUrl(),
      isAuthenticated,
      webSocketConnected,
      hasWebSocketObject: !!WebSocketService.ws,
      webSocketState: WebSocketService.ws ? WebSocketService.ws.readyState : 'N/A',
      reconnectAttempts: WebSocketService.reconnectAttempts,
    });
    
    setMqttStats(stats);
  };

  const getWebSocketStateName = (state) => {
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    return states[state] || 'UNKNOWN';
  };

  const runFullDiagnostic = () => {
    console.log('🚀 RUNNING FULL MQTT DIAGNOSTIC...');
    
    // Step 1: Debug connection
    WebSocketService.debugWebSocketConnection();
    
    // Step 2: Test message flow
    setTimeout(() => {
      WebSocketService.testMQTTMessageFlow();
    }, 1000);
    
    // Step 3: Show stats
    setTimeout(() => {
      WebSocketService.logMQTTStats();
    }, 6000);
    
    Alert.alert('Diagnostic Started', 'Check console for detailed output. Test messages will be sent over the next 5 seconds.');
  };

  const forceReconnect = () => {
    WebSocketService.disconnect();
    setTimeout(() => {
      WebSocketService.connect();
      updateConnectionInfo();
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 WebSocket & MQTT Debugger</Text>
      
      {/* Connection Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📡 Connection Status</Text>
        <Text style={styles.info}>WebSocket URL: {connectionInfo.url}</Text>
        <Text style={[styles.info, { color: connectionInfo.connected ? 'green' : 'red' }]}>
          Connection: {connectionInfo.connected ? '✅ Connected' : '❌ Disconnected'}
        </Text>
        <Text style={styles.info}>WebSocket Object: {connectionInfo.hasWebSocketObject ? '✅ Exists' : '❌ Missing'}</Text>
        <Text style={styles.info}>
          State: {getWebSocketStateName(connectionInfo.webSocketState)} ({connectionInfo.webSocketState})
        </Text>
        <Text style={styles.info}>Reconnect Attempts: {connectionInfo.reconnectAttempts}</Text>
      </View>

      {/* Authentication Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Authentication</Text>
        <Text style={[styles.info, { color: isAuthenticated ? 'green' : 'red' }]}>
          Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}
        </Text>
        <Text style={styles.info}>User: {user ? user.username || user.email || 'Unknown' : 'Not logged in'}</Text>
        <Text style={styles.info}>Context WebSocket: {webSocketConnected ? '✅ Connected' : '❌ Disconnected'}</Text>
      </View>

      {/* MQTT Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 MQTT Statistics</Text>
        <Text style={styles.info}>Total MQTT Messages: {mqttStats.totalMQTTMessages || 0}</Text>
        <Text style={styles.info}>Unique Topics: {mqttStats.uniqueTopics || 0}</Text>
        <Text style={styles.info}>Active Listeners: {mqttStats.activeListeners || 0}</Text>
        <Text style={styles.info}>Total Notifications: {mqttStats.totalNotifications || 0}</Text>
        {mqttStats.topics && mqttStats.topics.length > 0 && (
          <Text style={styles.info}>Topics: {mqttStats.topics.join(', ')}</Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={runFullDiagnostic}>
          <Text style={styles.buttonText}>🚀 Run Full Diagnostic</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={forceReconnect}>
          <Text style={styles.buttonText}>🔄 Force Reconnect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.tertiaryButton]} 
          onPress={() => {
            WebSocketService.simulateMessage('mqtt');
            updateConnectionInfo();
          }}
        >
          <Text style={styles.buttonText}>📨 Send Test MQTT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.warningButton]} 
          onPress={() => {
            WebSocketService.clearNotifications();
            updateConnectionInfo();
          }}
        >
          <Text style={styles.buttonText}>🗑️ Clear Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Troubleshooting Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Troubleshooting Tips</Text>
        <Text style={styles.tip}>1. Make sure you're logged in (Authentication must be ✅)</Text>
        <Text style={styles.tip}>2. Check network connectivity to 192.168.178.63:3000</Text>
        <Text style={styles.tip}>3. Verify API Gateway is running and accessible</Text>
        <Text style={styles.tip}>4. WebSocket should be in OPEN state (1)</Text>
        <Text style={styles.tip}>5. Active Listeners should be {'>'}0 when on NotificationScreen</Text>
        <Text style={styles.tip}>6. MQTT messages should have format: MQTT_EVENT|topic|payload|timestamp</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  buttonSection: {
    marginBottom: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
  },
  tertiaryButton: {
    backgroundColor: '#FF9500',
  },
  warningButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WebSocketDebugger;
