import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CommunityService from '../services/CommunityService';
import { useApp } from '../context/AppContext';

const CommunityScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'polls'
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('post'); // 'post' or 'poll'
  const [postContent, setPostContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const { user } = useApp();

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    try {
      if (activeTab === 'posts') {
        const result = await CommunityService.getAllPosts();
        if (result.success) {
          setPosts(result.posts);
        } else {
          Alert.alert('Error', result.error || 'Failed to load posts');
        }
      } else {
        const result = await CommunityService.getAllPolls();
        if (result.success) {
          setPolls(result.polls);
        } else {
          Alert.alert('Error', result.error || 'Failed to load polls');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load content');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadContent();
  };

  const handleLikePost = async (post) => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to like posts');
      return;
    }

    try {
      const result = await CommunityService.likePost(post.postID, user.id);
      if (result.success) {
        loadContent(); // Refresh to show updated likes
      } else {
        Alert.alert('Error', result.error || 'Failed to like post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to like post');
    }
  };

  const handleSharePost = async (post) => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to share posts');
      return;
    }

    try {
      const result = await CommunityService.sharePost(post.postID, user.id);
      if (result.success) {
        Alert.alert('Success', 'Post shared successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to share post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share post');
    }
  };

  const handleVoteOnPoll = async (poll, selectedOption) => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to vote');
      return;
    }

    try {
      const voteData = {
        userID: user.id,
        selectedOption: selectedOption
      };
      const result = await CommunityService.voteOnPoll(poll.pollID, voteData);
      if (result.success) {
        loadContent(); // Refresh to show updated votes
      } else {
        Alert.alert('Error', result.error || 'Failed to vote');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to vote');
    }
  };

  const handleCreatePost = async () => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to create posts');
      return;
    }

    if (!postContent.trim()) {
      Alert.alert('Error', 'Please enter post content');
      return;
    }

    try {
      const postData = {
        authorID: user.id,
        content: postContent.trim()
      };
      const result = await CommunityService.createPost(postData);
      if (result.success) {
        Alert.alert('Success', 'Post created successfully!');
        setPostContent('');
        setShowCreateModal(false);
        loadContent();
      } else {
        Alert.alert('Error', result.error || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleCreatePoll = async () => {
    if (!user || user.guest) {
      Alert.alert('Login Required', 'Please login to create polls');
      return;
    }

    if (!pollQuestion.trim()) {
      Alert.alert('Error', 'Please enter poll question');
      return;
    }

    const validOptions = pollOptions.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      Alert.alert('Error', 'Please provide at least 2 options');
      return;
    }

    try {
      const pollData = {
        authorID: user.id,
        question: pollQuestion.trim(),
        options: validOptions.reduce((acc, option) => {
          acc[option.trim()] = 0;
          return acc;
        }, {})
      };
      const result = await CommunityService.createPoll(pollData);
      if (result.success) {
        Alert.alert('Success', 'Poll created successfully!');
        setPollQuestion('');
        setPollOptions(['', '']);
        setShowCreateModal(false);
        loadContent();
      } else {
        Alert.alert('Error', result.error || 'Failed to create poll');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create poll');
    }
  };

  const renderPost = (post) => {
    const formattedPost = CommunityService.formatPostForDisplay(post);
    const isLiked = CommunityService.isPostLikedByUser(post, user?.id);
    
    return (
      <View key={post.postID} style={styles.postCard}>
        <View style={styles.postHeader}>
          <Text style={styles.postAuthor}>User {post.authorID}</Text>
          <Text style={styles.postTime}>{formattedPost.timeAgo}</Text>
        </View>
        
        <Text style={styles.postContent}>{post.content}</Text>
        
        <View style={styles.postActions}>
          <TouchableOpacity
            style={[styles.actionButton, isLiked && styles.likedButton]}
            onPress={() => handleLikePost(post)}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#ff3040" : "#666"} 
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {formattedPost.likeCount}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSharePost(post)}
          >
            <Ionicons name="share-outline" size={20} color="#666" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderPoll = (poll) => {
    const formattedPoll = CommunityService.formatPollForDisplay(poll);
    const totalVotes = formattedPoll.totalVotes;
    
    return (
      <View key={poll.pollID} style={styles.pollCard}>
        <View style={styles.pollHeader}>
          <Text style={styles.pollAuthor}>User {poll.authorID}</Text>
          <Text style={styles.pollTime}>{formattedPoll.timeAgo}</Text>
        </View>
        
        <Text style={styles.pollQuestion}>{poll.question}</Text>
        
        <View style={styles.pollOptions}>
          {Object.entries(poll.options || {}).map(([option, votes]) => {
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <TouchableOpacity
                key={option}
                style={styles.pollOption}
                onPress={() => handleVoteOnPoll(poll, option)}
              >
                <View style={styles.pollOptionContent}>
                  <Text style={styles.pollOptionText}>{option}</Text>
                  <Text style={styles.pollOptionVotes}>{votes} votes ({percentage}%)</Text>
                </View>
                <View style={[styles.pollOptionBar, { width: `${percentage}%` }]} />
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={styles.pollTotal}>Total votes: {totalVotes}</Text>
      </View>
    );
  };

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Create {createType === 'post' ? 'Post' : 'Poll'}
            </Text>
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          {createType === 'post' ? (
            <View style={styles.createForm}>
              <TextInput
                style={styles.textInput}
                placeholder="What's on your mind?"
                multiline
                value={postContent}
                onChangeText={setPostContent}
                maxLength={2000}
              />
              <TouchableOpacity style={styles.modalCreateButton} onPress={handleCreatePost}>
                <Text style={styles.modalCreateButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.createForm}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask a question..."
                value={pollQuestion}
                onChangeText={setPollQuestion}
                maxLength={500}
              />
              {pollOptions.map((option, index) => (
                <TextInput
                  key={index}
                  style={styles.textInput}
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...pollOptions];
                    newOptions[index] = text;
                    setPollOptions(newOptions);
                  }}
                />
              ))}
              <TouchableOpacity
                style={styles.addOptionButton}
                onPress={() => setPollOptions([...pollOptions, ''])}
              >
                <Text style={styles.addOptionText}>+ Add Option</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCreateButton} onPress={handleCreatePoll}>
                <Text style={styles.modalCreateButtonText}>Create Poll</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>      <TouchableOpacity
        style={styles.headerCreateButton}
        onPress={() => {
          setCreateType(activeTab); // Set to current tab (posts/polls)
          setShowCreateModal(true);
        }}
      >
        <Ionicons name="add" size={24} color="#007AFF" />
        <Text style={styles.headerCreateButtonText}>Create</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'polls' && styles.activeTab]}
          onPress={() => setActiveTab('polls')}
        >
          <Text style={[styles.tabText, activeTab === 'polls' && styles.activeTabText]}>
            Polls
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'posts' ? (
          posts.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No posts yet</Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => {
                  setCreateType('post');
                  setShowCreateModal(true);
                }}
              >
                <Text style={styles.createFirstButtonText}>Create First Post</Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map(renderPost)
          )
        ) : (
          polls.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bar-chart-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No polls yet</Text>
              <TouchableOpacity
                style={styles.createFirstButton}
                onPress={() => {
                  setCreateType('poll');
                  setShowCreateModal(true);
                }}
              >
                <Text style={styles.createFirstButtonText}>Create First Poll</Text>
              </TouchableOpacity>
            </View>
          ) : (
            polls.map(renderPoll)
          )
        )}
      </ScrollView>

      {renderCreateModal()}
    </View>
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
  headerCreateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  headerCreateButtonText: {
    color: '#007AFF',
    marginLeft: 5,
    fontWeight: '500',
  },
  modalCreateButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCreateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  // Post styles
  postCard: {
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
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  postContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 15,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  likedButton: {
    backgroundColor: '#ffe0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  likedText: {
    color: '#ff3040',
  },
  // Poll styles
  pollCard: {
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
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pollAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  pollTime: {
    fontSize: 12,
    color: '#666',
  },
  pollQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  pollOptions: {
    marginBottom: 10,
  },
  pollOption: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    position: 'relative',
  },
  pollOptionContent: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  pollOptionText: {
    fontSize: 16,
    color: '#333',
  },
  pollOptionVotes: {
    fontSize: 14,
    color: '#666',
  },
  pollOptionBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    opacity: 0.1,
  },
  pollTotal: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  createForm: {
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  addOptionButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 15,
  },
  addOptionText: {
    color: '#007AFF',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Empty state styles
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
  createFirstButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createFirstButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CommunityScreen;
