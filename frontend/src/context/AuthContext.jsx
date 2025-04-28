import { createContext, useContext, useEffect, useState } from 'react';
import { isTokenValid } from '../utils/auth';
import { getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    if (token && isTokenValid()) {
      getProfile()
        .then(res => setUser(res.data))
        .catch(() => logout());
    } else if (token) {
      logout();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
