import ApiService from './ApiService';

class EventService {
  constructor() {
    this.apiService = ApiService;
  }

  async getAllEvents() {
    try {
      const events = await this.apiService.getAllEvents();
      return { success: true, events };
    } catch (error) {
      console.error('Failed to get events:', error);
      return { success: false, error: error.message };
    }
  }

  async getEvent(eventId) {
    try {
      const event = await this.apiService.getEvent(eventId);
      return { success: true, event };
    } catch (error) {
      console.error(`Failed to get event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async createEvent(eventData) {
    try {
      console.log('[DEBUG] Creating event with data:', JSON.stringify(eventData, null, 2));
      const event = await this.apiService.createEvent(eventData);
      console.log('[DEBUG] Event created successfully:', event);
      return { success: true, event };
    } catch (error) {
      console.error('[ERROR] Failed to create event:', error);
      console.error('[ERROR] Event data that failed:', JSON.stringify(eventData, null, 2));
      return { success: false, error: error.message };
    }
  }

  async updateEvent(eventId, eventData) {
    try {
      const event = await this.apiService.updateEvent(eventId, eventData);
      return { success: true, event };
    } catch (error) {
      console.error(`Failed to update event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async deleteEvent(eventId) {
    try {
      await this.apiService.deleteEvent(eventId);
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async participateInEvent(eventId, userId) {
    try {
      const result = await this.apiService.participateInEvent(eventId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to participate in event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async removeParticipation(eventId, userId) {
    try {
      const result = await this.apiService.removeParticipation(eventId, userId);
      return { success: true, result };
    } catch (error) {
      console.error(`Failed to remove participation from event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  async addFeedback(eventId, feedbackData) {
    try {
      const feedback = await this.apiService.addFeedback(eventId, feedbackData);
      return { success: true, feedback };
    } catch (error) {
      console.error(`Failed to add feedback to event ${eventId}:`, error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to format event data for display
  formatEventForDisplay(event) {
    return {
      ...event,
      formattedDate: new Date(event.date).toLocaleDateString(),
      formattedTime: new Date(event.date).toLocaleTimeString(),
      participantCount: event.participants ? event.participants.length : 0,
      feedbackCount: event.feedbacks ? event.feedbacks.length : 0
    };
  }

  // Helper method to check if user is participating
  isUserParticipating(event, userId) {
    return event.participants && event.participants.some(p => p.userId === userId);
  }
}

export default new EventService();
