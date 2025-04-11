import React, { useState, useEffect } from 'react';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';
import { getAllPosts } from '../services/api';
import { Alert, Spinner } from 'react-bootstrap';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response.data);
        setError('');
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refreshKey]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Post Sharing Feed</h2>
      
      <PostForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
      
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      
      {loading ? (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        posts.map(post => (
          <PostItem 
            key={post.id} 
            post={post} 
            onUpdate={() => setRefreshKey(prev => prev + 1)}
          />
        ))
      )}
    </div>
  );
};

export default HomePage;