import { useEffect, useState } from 'react';
import { getAllPosts } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Box,
  CircularProgress
} from '@mui/material';

export default function PostFeedPage() {
  const { token, userId } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await getAllPosts(token);
        setPosts(res);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadPosts();
    }
  }, [token]);

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        For You
      </Typography>

      {posts.length === 0 ? (
        <Typography>No posts found.</Typography>
      ) : (
        posts.map((post) => (
          <Card key={post.id} sx={{ mb: 3 }}>
            {post.imageUrl && (
              <CardMedia
                component="img"
                height="200"
                image={post.imageUrl}
                alt="Post image"
              />
            )}
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ mr: 1 }}>{post.user?.name?.[0]}</Avatar>
                <Typography variant="subtitle2">
                  {post.user?.name || 'Unknown User'}
                </Typography>
              </Box>
              <Typography variant="body1">{post.caption}</Typography>
              {post.imageLocal && (
                <Box mt={1}>
                  <Typography variant="caption" color="text.secondary">
                    Local Image: {post.imageLocal}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}
