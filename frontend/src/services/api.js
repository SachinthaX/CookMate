import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("Token being sent:", token);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfile = () => API.get('/api/users/me');
export const getMyPosts = () => API.get('/posts/mine');
export const updateBio = (bio) => API.put('/api/users/me', { bio });
