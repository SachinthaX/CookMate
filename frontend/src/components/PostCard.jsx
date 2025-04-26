import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  Collapse,
  TextField,
  Button,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { deletePost } from '../services/postService';
import { likePost, getComments, addComment, editComment, deleteComment } from '../services/commentService';
import EditPostModal from './EditPostModal';

export default function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [liked, setLiked] = useState(post.likes?.includes("dummy-user-id") || false);
  const [openEdit, setOpenEdit] = useState(false);
  const [comments, setComments] = useState([]);
  const [openComments, setOpenComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(0);

  const handleLike = async () => {
    try {
      await likePost(post.id, "dummy-user-id");
      if (liked) {
        setLikes((prev) => prev - 1);
      } else {
        setLikes((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post', error);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        await deletePost(post.id);
        alert('Post deleted successfully');
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert('Failed to delete post');
      }
    }
  };

  const toggleComments = async () => {
    if (!openComments) {
      try {
        const response = await getComments(post.id);
        setComments(response.data);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('Error fetching comments', error);
      }
    }
    setOpenComments(!openComments);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await addComment(post.id, "dummy-user-id", newComment.trim());
      setNewComment('');
      const response = await getComments(post.id);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Error adding comment', error);
    }
  };

  const handleEditComment = async (comment) => {
    const newText = prompt("Edit your comment:", comment.text);
    if (newText && newText.trim() !== "") {
      try {
        await editComment(comment.id, newText.trim());
        const response = await getComments(post.id);
        setComments(response.data);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('Error editing comment', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
      try {
        await deleteComment(commentId);
        const response = await getComments(post.id);
        setComments(response.data);
        setCommentCount(response.data.length);
      } catch (error) {
        console.error('Error deleting comment', error);
      }
    }
  };

  const mediaCount = post.mediaUrls?.length || 0;
  const displayUrls = post.mediaUrls?.slice(0, 4) || [];
  const extraCount = mediaCount > 4 ? mediaCount - 4 : 0;

  const getGridColumns = () => {
    if (displayUrls.length === 1) return 12;
    if (displayUrls.length === 2) return 6;
    return 6;
  };

  return (
    <Card
      sx={{
        maxWidth: 600,
        width: '100%',
        mx: 'auto',
        mb: 4,
        boxShadow: 4,
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      {/* User Info */}
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar>{post.userId?.charAt(0).toUpperCase() || 'U'}</Avatar>
          <Typography fontWeight="bold">{post.userId || 'User'}</Typography>
        </Box>

        {/* Edit & Delete Buttons */}
        <Box>
          <Tooltip title="Edit Post">
            <IconButton color="primary" onClick={() => setOpenEdit(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Post">
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Image Grid */}
      <Grid container spacing={0}>
        {displayUrls.map((url, index) => (
          <Grid item xs={getGridColumns()} key={index}>
            <Box
              sx={{
                height: 250,
                position: 'relative',
              }}
            >
              <img
                src={url}
                alt={`Post media ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {extraCount > 0 && index === 3 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}
                >
                  +{extraCount}
                </Box>
              )}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Like, Comment Buttons */}
      <Box p={2} display="flex" gap={2} alignItems="center">
        <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
          <FavoriteBorderIcon />
        </IconButton>
        <Typography variant="body2">{likes} Likes</Typography>

        <IconButton onClick={toggleComments} color="primary">
          <ChatBubbleOutlineIcon />
        </IconButton>
        <Typography variant="body2">{commentCount} Comments</Typography>
      </Box>

      {/* Post Content */}
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body1">{post.description}</Typography>
          <Typography variant="caption" color="text.secondary">
            Posted on {new Date(post.createdAt).toLocaleString()}
          </Typography>
        </Stack>
      </CardContent>

      {/* Comment Section */}
      <Collapse in={openComments} timeout="auto" unmountOnExit>
        <CardContent>
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.id} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2">{comment.userId}</Typography>
                  <Typography variant="body2">{comment.text}</Typography>
                </Box>
                <Box>
                  <Tooltip title="Edit Comment">
                    <IconButton size="small" color="primary" onClick={() => handleEditComment(comment)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Comment">
                    <IconButton size="small" color="error" onClick={() => handleDeleteComment(comment.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}
            <Box display="flex" gap={1}>
              <TextField
                size="small"
                placeholder="Add a comment..."
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="contained" onClick={handleAddComment}>
                Post
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Collapse>

      {/* Edit Modal */}
      {openEdit && (
        <EditPostModal open={openEdit} onClose={() => setOpenEdit(false)} post={post} />
      )}
    </Card>
  );
}
