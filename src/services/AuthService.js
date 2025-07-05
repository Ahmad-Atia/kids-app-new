import ApiService from './ApiService';
import { API_CONFIG, API_ENDPOINTS } from '../utils/constants';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authToken = null;
  }

  // Helper function to decode JWT token and extract user ID
  decodeJWTPayload(token) {
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }

  async login(credentials) {
    try {
      console.log('[DEBUG] AuthService login attempt:', { email: credentials.email });
      
      // The backend expects username/password, not email/password
      const loginData = {
        username: credentials.email, // Backend uses username field but we pass email value
        password: credentials.password
      };

      const response = await ApiService.login(loginData);
      
      if (response && response.value) {
        this.authToken = response.value;
        
        // Decode JWT token to extract user ID
        const tokenPayload = this.decodeJWTPayload(response.value);
        const userId = tokenPayload ? tokenPayload.sub : 'current-user';
        
        console.log('[DEBUG] Token payload:', tokenPayload);
        console.log('[DEBUG] Extracted user ID:', userId);
        
        this.currentUser = {
          id: userId,
          email: credentials.email,
          token: response.value,
          expiresAt: response.expiresAt
        };
        
        // Store in AsyncStorage for persistence
        await ApiService.setAuthToken(this.authToken);
        
        console.log('[DEBUG] Login successful:', { 
          userId: this.currentUser.id,
          expiresAt: response.expiresAt
        });
        return { success: true, user: this.currentUser };
      } else {
        console.log('[DEBUG] Login failed: No token in response');
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('[ERROR] Login failed:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  }

  async register(userData) {
    try {
      console.log('[DEBUG] AuthService register attempt:', { email: userData.email });
      
      // Map the frontend fields to backend expected fields
      const registerData = {
        name: userData.name,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth || '',
        interests: userData.interests || []
      };

      const response = await ApiService.register(registerData);
      
      if (response) {
        console.log('[DEBUG] Registration successful');
        
        // After successful registration, automatically login
        return await this.login({
          email: userData.email,
          password: userData.password
        });
      } else {
        return { success: false, error: 'Registration failed' };
      }
    } catch (error) {
      console.error('[ERROR] Registration failed:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  }

  async logout() {
    try {
      this.currentUser = null;
      this.authToken = null;
      await ApiService.clearAuthToken();
      console.log('[DEBUG] Logout successful');
      return { success: true };
    } catch (error) {
      console.error('[ERROR] Logout failed:', error);
      return { success: false, error: 'Logout failed' };
    }
  }

  async getCurrentUser() {
    try {
      if (this.currentUser) {
        return this.currentUser;
      }

      // Try to get token from storage
      const token = await ApiService.getAuthToken();
      if (token) {
        this.authToken = token;
        
        // Decode JWT token to extract user ID
        const tokenPayload = this.decodeJWTPayload(token);
        const userId = tokenPayload ? tokenPayload.sub : 'current-user';
        
        console.log('[DEBUG] Restored user from token:', { userId });
        
        this.currentUser = {
          token: token,
          id: userId
        };
        return this.currentUser;
      }

      return null;
    } catch (error) {
      console.error('[ERROR] Get current user failed:', error);
      return null;
    }
  }

  async initializeAuth() {
    try {
      const user = await this.getCurrentUser();
      return user;
    } catch (error) {
      console.error('[ERROR] Initialize auth failed:', error);
      return null;
    }
  }

  isAuthenticated() {
    return this.authToken !== null;
  }

  getAuthToken() {
    return this.authToken;
  }
}

export default new AuthService();
