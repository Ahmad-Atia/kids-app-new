import ApiService from './ApiService';

class CommunityService {
  constructor() {
    this.apiService = ApiService;
  }

  // Posts methods
  async getAllPosts() {
    try {
      const posts = await this.apiService.getAllPosts();
      return { success: true, posts };
    } catch (error) {
      console.error('Failed to get posts:', error);
      return { success: false, error: error.message };
    }
  }

  async createPost(postData) {
    try {
      const post = await this.apiService.createPost(postData);
      return { success: true, post };
    } catch (error) {
      console.error('Failed to create post:', error);
      return { success: false, error: error.message };
    }
  }

  async getPost(postId) {
    try {
      const post = await this.apiService.getPost(postId);
      return { success: true, post };
    } catch (error) {
      console.error(`Failed to get post ${postId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async likePost(postId, userId) {
    try {
      const result = await this.apiService.likePost(postId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to like post ${postId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async sharePost(postId, userId) {
    try {
      const result = await this.apiService.sharePost(postId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to share post ${postId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Polls methods
  async getAllPolls() {
    try {
      const polls = await this.apiService.getAllPolls();
      return { success: true, polls };
    } catch (error) {
      console.error('Failed to get polls:', error);
      return { success: false, error: error.message };
    }
  }

  async createPoll(pollData) {
    try {
      const poll = await this.apiService.createPoll(pollData);
      return { success: true, poll };
    } catch (error) {
      console.error('Failed to create poll:', error);
      return { success: false, error: error.message };
    }
  }

  async voteOnPoll(pollId, voteData) {
    try {
      const result = await this.apiService.voteOnPoll(pollId, voteData);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to vote on poll ${pollId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Comments methods
  async getComments(targetId) {
    try {
      const comments = await this.apiService.getComments(targetId);
      return { success: true, comments };
    } catch (error) {
      console.error(`Failed to get comments for ${targetId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async addComment(targetId, commentData) {
    try {
      const comment = await this.apiService.addComment(targetId, commentData);
      return { success: true, comment };
    } catch (error) {
      console.error(`Failed to add comment to ${targetId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to format post data for display
  formatPostForDisplay(post) {
    return {
      ...post,
      likeCount: post.likeCount || 0,
      createdDate: new Date(post.createdAt).toLocaleDateString(),
      timeAgo: this.getTimeAgo(post.createdAt)
    };
  }

  // Helper method to format poll data for display
  formatPollForDisplay(poll) {
    return {
      ...poll,
      totalVotes: Object.values(poll.options || {}).reduce((sum, count) => sum + count, 0),
      createdDate: new Date(poll.createdAt).toLocaleDateString(),
      timeAgo: this.getTimeAgo(poll.createdAt)
    };
  }

  // Helper method to check if user has liked a post
  isPostLikedByUser(post, userId) {
    return post.likeUserIds && post.likeUserIds.includes(userId);
  }

  // Helper method to get time ago string
  getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
}

export default new CommunityService();
