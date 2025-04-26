import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Like or Unlike a Post
export const likePost = (postId, userId) => {
  return axios.post(`${API_URL}/posts/${postId}/like`, null, { params: { userId } });
};

// Get all comments for a Post
export const getComments = (postId) => {
  return axios.get(`${API_URL}/posts/${postId}/comments`);
};

// Add a new comment
export const addComment = (postId, userId, text) => {
  return axios.post(`${API_URL}/posts/${postId}/comments`, null, { params: { userId, text } });
};

// Edit an existing comment
export const editComment = (commentId, newText) => {
  return axios.put(`${API_URL}/comments/${commentId}`, null, { params: { newText } });
};

// Delete a comment
export const deleteComment = (commentId) => {
  return axios.delete(`${API_URL}/comments/${commentId}`);
};
