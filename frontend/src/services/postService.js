import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts'; // Your backend endpoint

// Create a new post
export const createPost = (postData) => {
  return axios.post(API_URL, postData);
};

// Get all posts
export const getAllPosts = () => {
  return axios.get(API_URL);
};

// Get single post
export const getPostById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Update a post
export const updatePost = (id, postData) => {
  return axios.put(`${API_URL}/${id}`, postData);
};

// Delete a post
export const deletePost = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
