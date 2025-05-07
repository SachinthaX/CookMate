import API from './api';

const AuthService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      console.log('Register response:', response.data);
      if (response.data.success) {
        // Store user data including token in localStorage
        localStorage.setItem('currentUser', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      // Even if success field isn't explicitly set but we have an ID, consider it a success
      if (response.data.id) {
        // Ensure we have a success flag and preserve token
        const userData = { 
          ...response.data, 
          success: true,
          // Create timestamp for session validation
          loginTimestamp: new Date().getTime()
        };
        
        console.log('Storing user data in localStorage:', userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData;
      } else if (response.data.success) {
        // Add timestamp for session validation
        const userData = {
          ...response.data,
          loginTimestamp: new Date().getTime()
        };
        
        console.log('Storing user data in localStorage:', userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData;
      } else {
        return response.data;
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log("AuthService: Starting logout process");
      
      // First clear local storage and cookies immediately
      localStorage.removeItem('currentUser');
      
      // Clear any session cookies
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      // Now try to call the backend API (but don't wait for it)
      try {
        await API.post('/auth/logout');
        console.log("AuthService: Server logout successful");
      } catch (apiError) {
        console.error('API error during logout (continuing with local logout):', apiError);
      }
      
      console.log("AuthService: Logout complete - all local data cleared");
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      // Still ensure local data is cleared
      localStorage.removeItem('currentUser');
      return false;
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userJson = localStorage.getItem('currentUser');
    if (!userJson) return null;
    
    try {
      const userData = JSON.parse(userJson);
      
      // Validate session - expire after 12 hours
      const now = new Date().getTime();
      const loginTime = userData.loginTimestamp || 0;
      const sessionDuration = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
      
      if (now - loginTime > sessionDuration) {
        console.log('Session expired, clearing user data');
        localStorage.removeItem('currentUser');
        return null;
      }
      
      // Session is valid
      console.log('Valid user session found:', {
        id: userData.id,
        isAuthenticated: !!userData.id
      });
      
      return userData;
    } catch (e) {
      console.error('Error parsing user data from localStorage:', e);
      localStorage.removeItem('currentUser'); // Clear invalid data
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    try {
      const user = AuthService.getCurrentUser();
      const isValid = !!user && !!user.id;
      console.log("Auth check - isLoggedIn:", isValid, user?.id);
      return isValid;
    } catch (error) {
      console.error("Error checking login status:", error);
      return false;
    }
  },

  // Update user profile in localStorage after changes
  updateUserInStorage: (userData) => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        ...userData,
        // Extend session timestamp when updating user data
        loginTimestamp: new Date().getTime()
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  }
};

export default AuthService; 