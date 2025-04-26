import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import PostCard from './PostCard';
import { Container, Typography, CircularProgress, Box, Stack } from '@mui/material';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {posts.length === 0 ? (
        <Typography variant="h6" color="text.secondary" align="center" mt={5}>
          No posts available yet. 😕
        </Typography>
      ) : (
        <Stack spacing={4} alignItems="center">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      )}
    </Container>
  );
}
