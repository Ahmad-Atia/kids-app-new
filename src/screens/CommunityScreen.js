import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommunityService from '../services/CommunityService';
import { useApp } from '../context/AppContext';

const CommunityScreen = ({ navigation }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useApp();

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const result = await CommunityService.getAllCommunities();
      if (result.success) {
        setCommunities(result.communities);
      } else {
        Alert.alert('Error', result.error || 'Failed to load communities');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load communities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCommunities();
  };

  const handleJoinCommunity = async (community) => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to join communities');
      return;
    }

    try {
      const result = await CommunityService.joinCommunity(community.id, user.id);
      if (result.success) {
        Alert.alert('Success', 'Successfully joined the community!');
        loadCommunities();
      } else {
        Alert.alert('Error', result.error || 'Failed to join community');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to join community');
    }
  };

  const renderCommunityCard = (community) => {
    const formattedCommunity = CommunityService.formatCommunityForDisplay(community);
    const isMember = user && !user.guest && CommunityService.isUserMember(community, user.id);
    
    return (
      <View key={community.id} style={styles.communityCard}>
        <View style={styles.communityHeader}>
          <Text style={styles.communityName}>{community.name}</Text>
          <Text style={styles.memberCount}>
            {formattedCommunity.memberCount} members
          </Text>
        </View>
        
        <Text style={styles.communityDescription} numberOfLines={3}>
          {community.description}
        </Text>
        
        <View style={styles.communityActions}>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {/* Navigate to community details */}}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          
          {!isMember ? (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinCommunity(community)}
            >
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.memberBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#28a745" />
              <Text style={styles.memberText}>Member</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading communities...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => {/* Navigate to create community */}}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      {communities.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No communities available</Text>
          <TouchableOpacity
            style={styles.createCommunityButton}
            onPress={() => {/* Navigate to create community */}}
          >
            <Text style={styles.createCommunityButtonText}>Create First Community</Text>
          </TouchableOpacity>
        </View>
      ) : (
        communities.map(renderCommunityCard)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#007AFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  communityCard: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  communityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  communityActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  memberText: {
    color: '#28a745',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  createCommunityButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createCommunityButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommunityScreen;
