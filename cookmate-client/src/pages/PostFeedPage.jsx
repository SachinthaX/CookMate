// PostFeedPage.jsx
import React from 'react';
import { Container, Typography } from '@mui/material';
import PostFeed from '../components/posts/PostFeed';

const PostFeedPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Feed
      </Typography>
      <PostFeed />
    </Container>
  );
};

export default PostFeedPage;
