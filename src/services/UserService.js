import ApiService from './ApiService';

class UserService {
  constructor() {
    this.apiService = ApiService;
  }

  async getAllUsers() {
    try {
      const users = await this.apiService.getAllUsers();
      return { success: true, users };
    } catch (error) {
      console.error('Failed to get users:', error);
      return { success: false, error: error.message };
    }
  }

  async getUserProfile(userId) {
    try {
      const user = await this.apiService.getUserProfile(userId);
      return { success: true, user };
    } catch (error) {
      console.error(`Failed to get user profile ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async updateUserProfile(userId, userData) {
    try {
      const user = await this.apiService.updateUserProfile(userId, userData);
      return { success: true, user };
    } catch (error) {
      console.error(`Failed to update user profile ${userId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to format user data for display
  formatUserForDisplay(user) {
    return {
      ...user,
      fullName: `${user.name} ${user.lastname}`,
      age: user.dateOfBirth ? this.calculateAge(user.dateOfBirth) : null,
      interestCount: user.interests ? user.interests.length : 0
    };
  }

  // Helper method to calculate age
  calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Helper method to validate user data
  validateUserData(userData) {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }
    
    if (!userData.lastname || userData.lastname.trim().length < 2) {
      errors.push('Last name must be at least 2 characters long');
    }
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Please provide a valid email address');
    }
    
    if (!userData.password || userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Helper method to validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default new UserService();
