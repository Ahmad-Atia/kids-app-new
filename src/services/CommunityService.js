import ApiService from './ApiService';

class CommunityService {
  constructor() {
    this.apiService = ApiService;
  }

  async getAllCommunities() {
    try {
      const communities = await this.apiService.getAllCommunities();
      return { success: true, communities };
    } catch (error) {
      console.error('Failed to get communities:', error);
      return { success: false, error: error.message };
    }
  }

  async getCommunity(communityId) {
    try {
      const community = await this.apiService.getCommunity(communityId);
      return { success: true, community };
    } catch (error) {
      console.error(`Failed to get community ${communityId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async createCommunity(communityData) {
    try {
      const community = await this.apiService.createCommunity(communityData);
      return { success: true, community };
    } catch (error) {
      console.error('Failed to create community:', error);
      return { success: false, error: error.message };
    }
  }

  async joinCommunity(communityId, userId) {
    try {
      const result = await this.apiService.joinCommunity(communityId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to join community ${communityId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async leaveCommunity(communityId, userId) {
    try {
      const result = await this.apiService.leaveCommunity(communityId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to leave community ${communityId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to format community data for display
  formatCommunityForDisplay(community) {
    return {
      ...community,
      memberCount: community.members ? community.members.length : 0,
      createdDate: new Date(community.createdAt).toLocaleDateString()
    };
  }

  // Helper method to check if user is a member
  isUserMember(community, userId) {
    return community.members && community.members.some(m => m.userId === userId);
  }
}

export default new CommunityService();
