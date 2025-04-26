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
  import CloseIcon from '@mui/icons-material/Close';
  import { useState, useEffect } from 'react';
  import { updatePost } from '../services/postService';
  
  export default function EditPostModal({ open, onClose, post }) {
    const [description, setDescription] = useState('');
    const [mediaUrls, setMediaUrls] = useState([]);
  
    useEffect(() => {
      if (post) {
        setDescription(post.description || '');
        setMediaUrls(post.mediaUrls || []);
      }
    }, [post]);
  
    const handleMediaChange = (index, value) => {
      const updated = [...mediaUrls];
      updated[index] = value;
      setMediaUrls(updated);
    };
  
    const handleSubmit = async () => {
      const payload = {
        description,
        mediaUrls: mediaUrls.filter((url) => url.trim() !== ''),
      };
  
      try {
        await updatePost(post.id, payload);
        alert('Post updated successfully!');
        onClose();
        window.location.reload(); // better: later update posts dynamically
      } catch (error) {
        console.error(error);
        alert('Failed to update post');
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Edit Post
          <IconButton onClick={onClose} sx={{ position: 'absolute', right: 16, top: 16 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
  
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="Post Description"
              multiline
              minRows={3}
              fullWidth
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
  
            <Box>
              <Typography variant="subtitle1" mb={1}>
                Media URLs
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
            </Box>
          </Stack>
        </DialogContent>
  
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  