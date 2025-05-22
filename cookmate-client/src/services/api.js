import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Allow cookies if used for session
});

// Request interceptor to attach token
API.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        if (userData.token) {
          config.headers['Authorization'] = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error('API interceptor: Failed to parse user token', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response, config } = error;

    const isAuthError = response?.status === 401;
    const isFromAppApi = config?.url?.startsWith('/api');
    const isNotGroqCall = !config?.url?.includes('/users/chat');

    if (isAuthError && isFromAppApi && isNotGroqCall && !config._retry) {
      console.warn('API: User session expired or unauthorized. Logging out...');
      localStorage.removeItem('currentUser');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default API;
