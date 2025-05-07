import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';

// Create auth context
const AuthContext = createContext(null);

// Export the provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        console.log("Auth context initialization:", { 
          user: user ? { id: user.id, email: user.email } : null,
          isAuthenticated: !!user && !!user.id
        });
        setCurrentUser(user);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };
    
    checkAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      console.log("Register in context:", response);
      
      if (response && (response.id || response.success)) {
        setCurrentUser(response);
      }
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      console.log("Login in context:", response);
      
      if (response && (response.id || response.success)) {
        setCurrentUser(response);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      console.log("AuthContext: Starting logout process for user:", currentUser?.id);
      
      // Always clear current user state first to prevent UI flashing
      setCurrentUser(null);
      
      // Call the service logout (which handles local storage clearing)
      await AuthService.logout();
      
      console.log("AuthContext: Logout complete");
      return true;
    } catch (error) {
      console.error("AuthContext: Logout error:", error);
      // Ensure state is cleared even if API fails
      setCurrentUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    if (!userData) return;
    
    try {
      AuthService.updateUserInStorage(userData);
      setCurrentUser(prevUser => ({
        ...prevUser,
        ...userData
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Return context provider
  const isAuthenticated = !!currentUser && !!currentUser.id;
  console.log("Auth context state:", { 
    isAuthenticated, 
    userId: currentUser?.id,
    authInitialized,
    loading
  });
  
  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      register,
      login,
      logout,
      updateUser,
      isAuthenticated,
      authInitialized
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 