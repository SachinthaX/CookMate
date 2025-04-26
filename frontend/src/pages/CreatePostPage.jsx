import { useState } from 'react';
import { createPost } from '../services/postService';
import { Box, Button, TextField, Stack, IconButton, Typography } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useNavigate } from 'react-router-dom';

export default function PostForm() {
  const [description, setDescription] = useState('');
  const [mediaUrls, setMediaUrls] = useState(['']);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const filteredMediaUrls = mediaUrls.filter((url) => url.trim() !== '');

    try {
      await createPost({ description, mediaUrls: filteredMediaUrls });
      alert('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating post', error);
      alert('Failed to create post');
    }
  };

  const handleMediaUrlChange = (index, value) => {
    const newUrls = [...mediaUrls];
    newUrls[index] = value;
    setMediaUrls(newUrls);
  };

  const addMediaField = () => {
    if (mediaUrls.length < 3) {
      setMediaUrls([...mediaUrls, '']);
    }
  };

  const removeMediaField = (index) => {
    const newUrls = mediaUrls.filter((_, idx) => idx !== index);
    setMediaUrls(newUrls);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Post Description"
          multiline
          minRows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="outlined"
          required
        />

        <Box>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Media URLs (up to 3 images/videos)
          </Typography>

          {mediaUrls.map((url, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center" mb={2}>
              <TextField
                label={`Media URL ${index + 1}`}
                value={url}
                onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                fullWidth
                variant="outlined"
                placeholder="https://example.com/image.jpg"
              />
              <IconButton color="error" onClick={() => removeMediaField(index)}>
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Stack>
          ))}

          {mediaUrls.length < 3 && (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={addMediaField}
              variant="outlined"
              color="primary"
            >
              Add Media URL
            </Button>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, borderRadius: 2 }}
        >
          Submit Post
        </Button>
      </Stack>
    </form>
  );
}
