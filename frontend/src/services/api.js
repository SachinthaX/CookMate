import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Posts API
export const createPost = (postData) => API.post('/posts', postData);
export const getPost = (id) => API.get(`/posts/${id}`);
export const updatePost = (id, postData) => API.put(`/posts/${id}`, postData);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const getAllPosts = () => API.get('/posts');

// Error handling interceptor
API.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || 
                   error.response?.data?.error || 
                   'Something went wrong!';
    return Promise.reject(message);
  }
);

export default API;