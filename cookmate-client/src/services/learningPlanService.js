import API from './api';

const LearningPlanService = {
  // Get all learning plans
  getAllLearningPlans: async () => {
    try {
      const response = await API.get('/learning-plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching learning plans:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get a single learning plan by ID
  getLearningPlanById: async (id) => {
    if (!id) {
      console.error('getLearningPlanById called without id');
      throw new Error('Learning plan ID is required');
    }
    
    try {
      const response = await API.get(`/learning-plans/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plan ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get learning plans by user ID
  getLearningPlansByUser: async (userId) => {
    if (!userId) {
      console.error('getLearningPlansByUser called without userId');
      throw new Error('User ID is required');
    }
    
    try {
      console.log('Fetching learning plans for user:', userId);
      const response = await API.get(`/learning-plans/user/${userId}`);
      console.log(`Found ${response.data.length} learning plans for user ${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plans for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get learning plans by user ID and completion status
  getLearningPlansByUserAndStatus: async (userId, completed) => {
    if (!userId) {
      console.error('getLearningPlansByUserAndStatus called without userId');
      throw new Error('User ID is required');
    }
    
    try {
      console.log(`Fetching ${completed ? 'completed' : 'in-progress'} learning plans for user:`, userId);
      const response = await API.get(`/learning-plans/user/${userId}/status?completed=${completed}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning plans for user ${userId} with status ${completed}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new learning plan
  createLearningPlan: async (learningPlan) => {
    if (!learningPlan || !learningPlan.userId) {
      console.error('createLearningPlan called without userId in the data');
      throw new Error('User ID is required to create a learning plan');
    }
    
    try {
      console.log('Creating learning plan:', { 
        title: learningPlan.title,
        userId: learningPlan.userId 
      });
      const response = await API.post('/learning-plans', learningPlan);
      console.log('Learning plan created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error creating learning plan:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing learning plan
  updateLearningPlan: async (id, learningPlan) => {
    if (!id) {
      console.error('updateLearningPlan called without id');
      throw new Error('Learning plan ID is required');
    }
    
    try {
      console.log('Updating learning plan:', { 
        id, 
        userId: learningPlan.userId 
      });
      const response = await API.put(`/learning-plans/${id}`, learningPlan);
      console.log('Learning plan updated successfully:', id);
      return response.data;
    } catch (error) {
      console.error(`Error updating learning plan ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Update learning plan progress
  updateLearningPlanProgress: async (id, progress) => {
    if (!id) {
      console.error('updateLearningPlanProgress called without id');
      throw new Error('Learning plan ID is required');
    }
    
    try {
      console.log(`Updating progress for learning plan ${id} to ${progress}%`);
      const response = await API.patch(`/learning-plans/${id}/progress?progress=${progress}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress for learning plan ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a learning plan
  deleteLearningPlan: async (id) => {
    if (!id) {
      console.error('deleteLearningPlan called without id');
      throw new Error('Learning plan ID is required');
    }
    
    try {
      await API.delete(`/learning-plans/${id}`);
      console.log('Learning plan deleted successfully:', id);
      return true;
    } catch (error) {
      console.error(`Error deleting learning plan ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default LearningPlanService; 