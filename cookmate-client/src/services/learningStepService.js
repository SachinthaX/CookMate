import API from './api';

const LearningStepService = {
  // Get all learning steps for a plan
  getLearningStepsByPlanId: async (planId) => {
    if (!planId) {
      console.error('getLearningStepsByPlanId called without planId');
      throw new Error('Learning plan ID is required');
    }

    try {
      console.log('Fetching learning steps for plan:', planId);
      const response = await API.get(`/learning-steps/plan/${planId}`);
      console.log(`Found ${response.data.length} learning steps for plan ${planId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning steps for plan ${planId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Get a learning step by ID
  getLearningStepById: async (id) => {
    if (!id) {
      console.error('getLearningStepById called without id');
      throw new Error('Learning step ID is required');
    }

    try {
      console.log('Fetching learning step:', id);
      const response = await API.get(`/learning-steps/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching learning step ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new learning step
  createLearningStep: async (learningStep) => {
    if (!learningStep || !learningStep.learningPlanId) {
      console.error('createLearningStep called without learningPlanId in the data');
      throw new Error('Learning plan ID is required to create a learning step');
    }

    try {
      console.log('Creating learning step for plan:', learningStep.learningPlanId);
      const response = await API.post('/learning-steps', learningStep);
      console.log('Learning step created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error creating learning step:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update an existing learning step
  updateLearningStep: async (id, learningStep) => {
    if (!id) {
      console.error('updateLearningStep called without id');
      throw new Error('Learning step ID is required');
    }

    try {
      console.log('Updating learning step:', id);
      const response = await API.put(`/learning-steps/${id}`, learningStep);
      console.log('Learning step updated successfully:', id);
      return response.data;
    } catch (error) {
      console.error(`Error updating learning step ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Update the completion status of a learning step
  updateLearningStepCompletion: async (id, userId, completed) => {
    if (!id) {
      console.error('updateLearningStepCompletion called without id');
      throw new Error('Learning step ID is required');
    }

    if (!userId) {
      console.error('updateLearningStepCompletion called without userId');
      throw new Error('User ID is required to update completion status');
    }

    try {
      console.log(`Updating completion status for learning step ${id} to ${completed ? 'completed' : 'incomplete'}`);
      const response = await API.patch(`/learning-steps/${id}/completion?completed=${completed}`);
      console.log(`Learning step ${id} ${completed ? 'marked as completed' : 'marked as incomplete'}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating completion status for learning step ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a learning step
  deleteLearningStep: async (id) => {
    if (!id) {
      console.error('deleteLearningStep called without id');
      throw new Error('Learning step ID is required');
    }

    try {
      await API.delete(`/learning-steps/${id}`);
      console.log('Learning step deleted successfully:', id);
      return true;
    } catch (error) {
      console.error(`Error deleting learning step ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Delete all learning steps for a plan
  deleteLearningStepsByPlanId: async (planId) => {
    if (!planId) {
      console.error('deleteLearningStepsByPlanId called without planId');
      throw new Error('Learning plan ID is required');
    }

    try {
      await API.delete(`/learning-steps/plan/${planId}`);
      console.log('All learning steps for plan deleted successfully:', planId);
      return true;
    } catch (error) {
      console.error(`Error deleting learning steps for plan ${planId}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default LearningStepService; 