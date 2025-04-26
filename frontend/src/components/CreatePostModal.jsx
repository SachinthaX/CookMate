import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    IconButton,
    Typography,
    Box,
  } from '@mui/material';
  import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
  import CloseIcon from '@mui/icons-material/Close';
  import { useState } from 'react';
  import { createPost } from '../services/postService';
  
  export default function CreatePostModal({ open, onClose }) {
    const [description, setDescription] = useState('');
    const [mediaUrls, setMediaUrls] = useState(['']);
    const [hashtags, setHashtags] = useState('');
  
    const handleMediaChange = (index, value) => {
      const updated = [...mediaUrls];
      updated[index] = value;
      setMediaUrls(updated);
    };
  
    const addMoreMedia = () => {
      if (mediaUrls.length < 3) {
        setMediaUrls([...mediaUrls, '']);
      }
    };
  
    const handleSubmit = async () => {
      const payload = {
        description: `${description}\n${hashtags}`,
        mediaUrls: mediaUrls.filter((url) => url.trim() !== ''),
      };
  
      try {
        await createPost(payload);
        alert('Post Created!');
        onClose();
        setDescription('');
        setMediaUrls(['']);
        setHashtags('');
      } catch (err) {
        console.error(err);
        alert('Failed to create post');
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Create Post
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle1" mb={1}>
                Add Media URLs
              </Typography>
              {mediaUrls.map((url, idx) => (
                <TextField
                  key={idx}
                  label={`Media URL ${idx + 1}`}
                  fullWidth
                  value={url}
                  onChange={(e) => handleMediaChange(idx, e.target.value)}
                  margin="dense"
                />
              ))}
              {mediaUrls.length < 3 && (
                <Button
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={addMoreMedia}
                  sx={{ mt: 1 }}
                >
                  Add Another Image
                </Button>
              )}
            </Box>
  
            <TextField
              label="Write a caption..."
              multiline
              minRows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
  
            <TextField
              label="Add hashtags (space separated)"
              placeholder="#food #recipe"
              fullWidth
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Post
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  