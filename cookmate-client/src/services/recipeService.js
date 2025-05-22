import API from './api';

// Recipe Service functions that match the backend RecipeService implementation
const RecipeService = {
  // Create a new recipe
  createRecipe: async (recipeData) => {
    try {
      console.log('Creating recipe with data:', { 
        title: recipeData.title,
        userId: recipeData.createdBy 
      });
      const response = await API.post('/recipes', recipeData);
      console.log('Recipe created successfully:', response.data.id);
      return response.data;
    } catch (error) {
      console.error('Error creating recipe:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get a recipe by its ID
  getRecipeById: async (id) => {
    try {
      const response = await API.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipe with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get all recipes
  getAllRecipes: async () => {
    try {
      const response = await API.get('/recipes');
      return response.data;
    } catch (error) {
      console.error('Error fetching all recipes:', error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get recipes by user ID
  getRecipesByUser: async (userId) => {
    if (!userId) {
      console.error('getRecipesByUser called without userId');
      throw new Error('User ID is required');
    }
    
    try {
      console.log('Fetching recipes for user:', userId);
      const response = await API.get(`/recipes/user/${userId}`);
      console.log(`Found ${response.data.length} recipes for user ${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes for user ${userId}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Search recipes by keyword
  searchRecipes: async (keyword) => {
    try {
      const response = await API.get(`/recipes/search?keyword=${encodeURIComponent(keyword)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching recipes with keyword "${keyword}":`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Get recipes by tag
  getRecipesByTag: async (tag) => {
    try {
      const response = await API.get(`/recipes/tag/${encodeURIComponent(tag)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching recipes with tag "${tag}":`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Update a recipe
  updateRecipe: async (id, recipeData) => {
    if (!id) {
      console.error('updateRecipe called without id');
      throw new Error('Recipe ID is required');
    }
    
    try {
      console.log('Updating recipe:', { id, userId: recipeData.createdBy });
      const response = await API.put(`/recipes/${id}`, recipeData);
      console.log('Recipe updated successfully:', id);
      return response.data;
    } catch (error) {
      console.error(`Error updating recipe with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },
  
  // Delete a recipe
  deleteRecipe: async (id) => {
    if (!id) {
      console.error('deleteRecipe called without id');
      throw new Error('Recipe ID is required');
    }
    
    try {
      await API.delete(`/recipes/${id}`);
      console.log('Recipe deleted successfully:', id);
      return true;
    } catch (error) {
      console.error(`Error deleting recipe with id ${id}:`, error.response?.data || error.message);
      throw error;
    }
  }
};

export default RecipeService; 