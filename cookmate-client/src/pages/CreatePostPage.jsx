import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Stack, Box, CircularProgress
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePostPage() {
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(['']);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3 - imageUrls.length);
    setImageFiles(files);
  };

  const handleUrlChange = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    setImageUrls(newUrls);
  };

  const addImageUrlField = () => {
    if (imageFiles.length + imageUrls.length < 3) {
      setImageUrls([...imageUrls, '']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload local files to Firebase
      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const fileRef = ref(storage, `posts/${uuidv4()}-${file.name}`);
          await uploadBytes(fileRef, file);
          return await getDownloadURL(fileRef);
        })
      );

      // Combine both local and URL images
      const allMediaUrls = [...uploadedUrls, ...imageUrls.filter((url) => url.trim() !== '')];

      // Send to backend
      await API.post('/posts', {
        description,
        mediaUrls: allMediaUrls,
      });

      alert('Post created!');
      navigate('/');
    } catch (err) {
      console.error('Post creation error:', err);
      alert('Something went wrong');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Create a Post
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Local Image Upload */}
          <Button variant="outlined" component="label" disabled={imageFiles.length + imageUrls.length >= 3}>
            Upload Image
            <input
              type="file"
              hidden
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Button>
          <Box>
            {imageFiles.map((file, idx) => (
              <Typography key={idx} variant="body2">{file.name}</Typography>
            ))}
          </Box>

          {/* Direct Image URL Input */}
          {imageUrls.map((url, idx) => (
            <TextField
              key={idx}
              label={`Image URL ${idx + 1}`}
              value={url}
              onChange={(e) => handleUrlChange(idx, e.target.value)}
              placeholder="https://example.com/image.jpg"
              fullWidth
            />
          ))}
          {imageFiles.length + imageUrls.length < 3 && (
            <Button onClick={addImageUrlField}>+ Add Image URL</Button>
          )}

          <Button type="submit" variant="contained" disabled={uploading}>
            {uploading ? <CircularProgress size={24} /> : 'Post'}
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
