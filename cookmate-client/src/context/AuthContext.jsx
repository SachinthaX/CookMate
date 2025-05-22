import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = AuthService.getCurrentUser();
        const storedToken = localStorage.getItem("token");

        console.log("Auth context initialization:", {
          user: user ? { id: user.id, email: user.email } : null,
          isAuthenticated: !!user && !!user.id,
        });

        setCurrentUser(user);
        setToken(storedToken);
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setCurrentUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        setAuthInitialized(true);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      console.log("Register in context:", response);

      if (response && (response.id || response.success)) {
        setCurrentUser(response);
        localStorage.setItem("token", response.token);
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      console.log("Login in context:", response);

      if (response && (response.id || response.success)) {
        setCurrentUser(response);
        localStorage.setItem("token", response.token);
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log("AuthContext: Starting logout process for user:", currentUser?.id);

      setCurrentUser(null);
      setToken(null);
      await AuthService.logout();

      console.log("AuthContext: Logout complete");
      return true;
    } catch (error) {
      console.error("AuthContext: Logout error:", error);
      setCurrentUser(null);
      setToken(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    if (!userData) return;

    try {
      AuthService.updateUserInStorage(userData);
      setCurrentUser((prevUser) => ({
        ...prevUser,
        ...userData,
      }));
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const isAuthenticated = !!currentUser && !!currentUser.id;
  const userId = currentUser?.id || null;

  console.log("Auth context state:", {
    isAuthenticated,
    userId,
    authInitialized,
    loading,
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userId,
        token,
        loading,
        register,
        login,
        logout,
        updateUser,
        isAuthenticated,
        authInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
