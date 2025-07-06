import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiService {
  constructor() {
    this.baseURL = 'http://192.168.178.63:3000/api';
    this.authToken = null;
    console.log('[DEBUG] ApiService initialized', { baseURL: this.baseURL });
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers with proper Content-Type
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    };

    // Add auth token if available
    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    const requestOptions = {
      method: 'GET',
      headers,
      ...options
    };

    // Ensure body is stringified for JSON requests
    if (requestOptions.body && typeof requestOptions.body === 'object') {
      requestOptions.body = JSON.stringify(requestOptions.body);
    }

    console.log('[DEBUG] API Request', {
      method: requestOptions.method,
      url,
      headers: Object.keys(headers),
      body: requestOptions.body
    });

    try {
      const response = await fetch(url, requestOptions);
      
      console.log('[DEBUG] API Response', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
      });

      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text.trim()) {
          responseData = JSON.parse(text);
        } else {
          responseData = {}; // Handle empty response
        }
      } else {
        responseData = await response.text();
      }

      if (!response.ok) {
        console.error('[ERROR] API Error Response', {
          status: response.status,
          error: responseData
        });
        throw new Error(`HTTP ${response.status}: ${typeof responseData === 'string' ? responseData : JSON.stringify(responseData)}`);
      }

      return responseData;
    } catch (error) {
      console.error('[ERROR] API request failed', {
        error: error.message,
        url
      });
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    console.log('Attempting login with credentials:', credentials);
    return this.request('/auth/login', {
      method: 'POST',
      body: credentials
    });
  }

  async register(userData) {
    console.log('Registering user with payload:', userData);
    return this.request('/users/register', {
      method: 'POST',
      body: userData
    });
  }

  // User methods
  async getAllUsers() {
    return this.request('/users/users');
  }

  async getUserProfile(userId) {
    return this.request(`/users/profile/${userId}`);
  }

  async updateUserProfile(userId, userData) {
    return this.request(`/users/profile/${userId}`, {
      method: 'PUT',
      body: userData
    });
  }

  // Event methods
  async getAllEvents() {
    return this.request('/events/events');
  }

  async getEvent(eventId) {
    return this.request(`/events/events/${eventId}`);
  }

  async createEvent(eventData) {
    return this.request('/events/events', {
      method: 'POST',
      body: eventData
    });
  }

  async updateEvent(eventId, eventData) {
    return this.request(`/events/events/${eventId}`, {
      method: 'PUT',
      body: eventData
    });
  }

  async deleteEvent(eventId) {
    return this.request(`/events/events/${eventId}`, {
      method: 'DELETE'
    });
  }

  async participateInEvent(eventId, userId) {
    return this.request(`/events/events/${eventId}/participants`, {
      method: 'POST',
      body: { userId }
    });
  }

  async removeParticipation(eventId, userId) {
    return this.request(`/events/events/${eventId}/participants`, {
      method: 'DELETE',
      body: { userId }
    });
  }

  async addFeedback(eventId, feedbackData) {
    return this.request(`/events/events/${eventId}/feedback`, {
      method: 'POST',
      body: feedbackData
    });
  }

  // Community methods - Updated to work with actual backend endpoints
  async getAllPosts() {
    return this.request('/community/posts');
  }

  async createPost(postData) {
    return this.request('/community/posts', {
      method: 'POST',
      body: postData
    });
  }

  async getPost(postId) {
    return this.request(`/community/posts/${postId}`);
  }

  async likePost(postId, userId) {
    return this.request(`/community/posts/${postId}/like?userId=${userId}`, {
      method: 'POST'
    });
  }

  async sharePost(postId, userId) {
    return this.request(`/community/posts/${postId}/share?userId=${userId}`, {
      method: 'POST'
    });
  }

  async getAllPolls() {
    return this.request('/community/polls');
  }

  async createPoll(pollData) {
    return this.request('/community/polls', {
      method: 'POST',
      body: pollData
    });
  }

  async voteOnPoll(pollId, voteData) {
    return this.request(`/community/polls/${pollId}/vote`, {
      method: 'POST',
      body: voteData
    });
  }

  async getComments(targetId) {
    return this.request(`/community/comments/${targetId}`);
  }

  async addComment(targetId, commentData) {
    return this.request(`/community/comments/${targetId}`, {
      method: 'POST',
      body: commentData
    });
  }

  // Utility methods
  async setAuthToken(token) {
    this.authToken = token;
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
    console.log('[DEBUG] Auth token set', { hasToken: !!token });
  }

  async getAuthToken() {
    if (!this.authToken) {
      try {
        this.authToken = await AsyncStorage.getItem('authToken');
      } catch (error) {
        console.error('Failed to get auth token:', error);
      }
    }
    console.log('[DEBUG] Retrieved auth token', { hasToken: !!this.authToken });
    return this.authToken;
  }

  async clearAuthToken() {
    this.authToken = null;
    await AsyncStorage.removeItem('authToken');
    console.log('[DEBUG] Auth token cleared');
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch('http://192.168.178.63:3000/actuator/health');
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  // Initialize auth state
  async initializeAuth() {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        this.authToken = token;
        return true;
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
    }
    return false;
  }
}

// Export singleton instance
export default new ApiService();
