import API from './api';

const NotificationService = {
  // Get all notifications for a user
  getNotificationsByUser: async (userId) => {
    try {
      const response = await API.get(`/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get only unread notifications for a user
  getUnreadNotifications: async (userId) => {
    try {
      const response = await API.get(`/notifications/user/${userId}/unread`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  },

  // Get the count of unread notifications
  getUnreadNotificationCount: async (userId) => {
    try {
      const response = await API.get(`/notifications/user/${userId}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching notification count:', error);
      throw error;
    }
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await API.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async (userId) => {
    try {
      await API.patch(`/notifications/user/${userId}/read-all`);
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      await API.delete(`/notifications/${notificationId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },

  // Create a new notification (typically called from backend, but can be used for testing)
  createNotification: async (notificationData) => {
    try {
      const response = await API.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }
};

export default NotificationService; 