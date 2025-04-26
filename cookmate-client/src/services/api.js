import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important: Allow cookies to be sent with requests
});

// Request interceptor for adding auth token
API.interceptors.request.use(
  (config) => {
    // Get current user from localStorage
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        // If user has token, add it to the request
        if (userData.token) {
          config.headers['Authorization'] = `Bearer ${userData.token}`;
        }
      } catch (e) {
        console.error('Error parsing user data in API interceptor:', e);
        // Don't block the request if parsing fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    const originalRequest = error.config;
    
    // Handle auth errors
    if (response && response.status === 401 && !originalRequest._retry) {
      console.log('API: Received 401 Unauthorized');
      
      // Only redirect to login if not already on login page and not a logout request
      if (!window.location.pathname.includes('/login') && 
          !originalRequest.url.includes('/auth/logout')) {
        
        console.log('API: Unauthorized request - clearing auth data');
        localStorage.removeItem('currentUser');
        
        // If this was not a direct API call from login page, redirect
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default API; 