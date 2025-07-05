import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from './Card';

export default function CommunityCard({ community, onPress, showJoinButton = false, onJoin, userIsMember = false }) {
  const getMemberCountText = () => {
    const count = community.members?.length || 0;
    return count === 1 ? '1 member' : `${count} members`;
  };

  const getEventCountText = () => {
    const count = community.events?.length || 0;
    return count === 1 ? '1 event' : `${count} events`;
  };

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {community.name}
        </Text>
        {userIsMember && (
          <View style={styles.memberBadge}>
            <Text style={styles.memberBadgeText}>Member</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={3}>
        {community.description}
      </Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{community.members?.length || 0}</Text>
          <Text style={styles.statLabel}>Members</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>{community.events?.length || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.statValue}>{community.isPublic ? 'Public' : 'Private'}</Text>
          <Text style={styles.statLabel}>Type</Text>
        </View>
      </View>

      {community.owner && (
        <View style={styles.ownerInfo}>
          <Text style={styles.ownerLabel}>Created by:</Text>
          <Text style={styles.ownerName}>
            {community.owner.firstName} {community.owner.lastName}
          </Text>
        </View>
      )}

      {showJoinButton && onJoin && (
        <TouchableOpacity
          style={[
            styles.joinButton,
            userIsMember ? styles.leaveButton : styles.joinButtonDefault
          ]}
          onPress={() => onJoin(community)}
        >
          <Text style={[
            styles.joinButtonText,
            userIsMember && styles.leaveButtonText
          ]}>
            {userIsMember ? 'Leave Community' : 'Join Community'}
          </Text>
        </TouchableOpacity>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  memberBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memberBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ownerLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  ownerName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  joinButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  joinButtonDefault: {
    backgroundColor: '#007AFF',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  leaveButtonText: {
    color: '#fff',
  },
});
