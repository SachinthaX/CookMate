import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  Rating,
  IconButton,
  TextField,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  AccessTime,
  Restaurant,
  Person,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
  PersonAdd,
  Print,
  ArrowBack,
  Edit,
  Delete
} from '@mui/icons-material';
import RecipeService from '../services/recipeService';

// Mock comments data (would come from a separate API in a real app)
const commentsData = [
  {
    id: 1,
    user: 'Sarah Johnson',
    avatar: 'https://source.unsplash.com/random/40x40/?woman',
    date: '3 days ago',
    content: 'Made this last night and it was amazing! The sauce was so creamy without any cream. Will definitely make it again!',
    rating: 5
  },
  {
    id: 2,
    user: 'Michael Brown',
    avatar: 'https://source.unsplash.com/random/40x40/?man',
    date: '1 week ago',
    content: 'Great recipe! I added a bit of cream to the sauce and it was delicious. My family loved it.',
    rating: 4
  },
  {
    id: 3,
    user: 'Jessica Lee',
    avatar: 'https://source.unsplash.com/random/40x40/?woman2',
    date: '2 weeks ago',
    content: 'The instructions were so clear and easy to follow. Perfect carbonara!',
    rating: 5
  }
];

// Mock nutritional info (would be part of the recipe in a real app)
const mockNutritionalInfo = {
  calories: 550,
  protein: '24g',
  carbs: '65g',
  fat: '22g',
  fiber: '3g',
  sugar: '2g'
};

const RecipeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [comments, setComments] = useState(commentsData);
  const [nutritionalInfo, setNutritionalInfo] = useState(mockNutritionalInfo);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Fetch recipe data when component mounts or id changes
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await RecipeService.getRecipeById(id);
        setRecipe(data);
        setIsSaved(data.saved || false);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch recipe:', err);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSaveRecipe = () => {
    setIsSaved(!isSaved);
    // In a real app, would send this to the backend
    setAlertMessage(isSaved ? 'Recipe removed from saved items' : 'Recipe saved successfully');
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  const handleLikeRecipe = () => {
    setIsLiked(!isLiked);
    // In a real app, would update the backend
    if (recipe) {
      const newLikes = isLiked ? (recipe.likes || 0) - 1 : (recipe.likes || 0) + 1;
      setRecipe({...recipe, likes: newLikes});
    }
    setAlertMessage(isLiked ? 'Removed like' : 'Added like');
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    // In a real app, would send to the backend
    const newComment = {
      id: comments.length + 1,
      user: 'Current User',
      avatar: 'https://source.unsplash.com/random/40x40/?person',
      date: 'Just now',
      content: commentText,
      rating: 5
    };
    
    setComments([newComment, ...comments]);
    setCommentText('');
    setAlertMessage('Comment added successfully');
    setAlertSeverity('success');
    setAlertOpen(true);
  };

  const handleEditRecipe = () => {
    navigate(`/recipes/edit/${id}`);
  };
  
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeleteRecipe = async () => {
    try {
      setLoading(true);
      await RecipeService.deleteRecipe(id);
      
      setAlertMessage('Recipe deleted successfully');
      setAlertSeverity('success');
      setAlertOpen(true);
      
      // Navigate back to recipes list after a short delay
      setTimeout(() => {
        navigate('/recipes');
      }, 1500);
      
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      setAlertMessage('Failed to delete recipe');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2 }}
        >
          Back to Recipes
        </Button>
      </Box>
    );
  }

  if (!recipe) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">Recipe not found</Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/recipes')}
          sx={{ mt: 2 }}
        >
          Back to Recipes
        </Button>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <Button 
              startIcon={<ArrowBack />} 
              onClick={() => navigate('/recipes')}
            >
              Back to Recipes
            </Button>
          </Box>
          
          <img 
            src={recipe.imageUrl || 'https://source.unsplash.com/random/1200x800/?food'} 
            alt={recipe.title}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              borderRadius: '8px',
              objectFit: 'cover'
            }}
          />
          
          <Paper
            sx={{
              position: 'absolute',
              bottom: -40,
              left: 20,
              right: 20,
              p: 3,
              borderRadius: 2,
              boxShadow: 3,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  {recipe.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={4.5} precision={0.1} size="small" readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    (237 reviews)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                    Published recently
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Print />}
                  sx={{ mr: 1 }}
                >
                  Print
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Share />}
                >
                  Share
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6, pt: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Recipe" />
              <Tab label="Nutrition" />
              <Tab label={`Comments (${comments.length})`} />
            </Tabs>
          </Box>
          
          {/* Recipe Tab */}
          {tabValue === 0 && (
            <>
              <Typography variant="body1" paragraph>
                {recipe.description}
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2, mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AccessTime color="primary" />
                    <Typography variant="subtitle2">Prep Time</Typography>
                    <Typography variant="body1">{recipe.preparationTimeMinutes} min</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <AccessTime color="primary" />
                    <Typography variant="subtitle2">Cook Time</Typography>
                    <Typography variant="body1">{recipe.cookingTimeMinutes} min</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Restaurant color="primary" />
                    <Typography variant="subtitle2">Servings</Typography>
                    <Typography variant="body1">{recipe.servings}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Person color="primary" />
                    <Typography variant="subtitle2">Difficulty</Typography>
                    <Typography variant="body1">{recipe.difficulty}</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Typography variant="h5" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
              
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((step, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemText 
                      primary={
                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                          Step {index + 1}
                        </Typography>
                      } 
                      secondary={step} 
                    />
                  </ListItem>
                ))}
              </List>
              
              {recipe.tags && recipe.tags.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {recipe.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
          
          {/* Nutrition Tab */}
          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Nutritional Information
              </Typography>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Calories</Typography>
                    <Typography variant="h6">{nutritionalInfo.calories} kcal</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Protein</Typography>
                    <Typography variant="h6">{nutritionalInfo.protein}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Carbs</Typography>
                    <Typography variant="h6">{nutritionalInfo.carbs}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Fat</Typography>
                    <Typography variant="h6">{nutritionalInfo.fat}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Fiber</Typography>
                    <Typography variant="h6">{nutritionalInfo.fiber}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="subtitle1">Sugar</Typography>
                    <Typography variant="h6">{nutritionalInfo.sugar}</Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Typography variant="subtitle1" gutterBottom>
                Disclaimer
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nutritional information is an estimate only and may vary based on ingredients and portion sizes.
              </Typography>
            </Box>
          )}
          
          {/* Comments Tab */}
          {tabValue === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Add a Comment
              </Typography>
              <Box component="form" onSubmit={handleSubmitComment} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share your experience with this recipe..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </Box>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h5" gutterBottom>
                Comments ({comments.length})
              </Typography>
              
              {comments.map((comment) => (
                <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', mb: 1 }}>
                    <Avatar src={comment.avatar} alt={comment.user} />
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="subtitle1">{comment.user}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={comment.rating} size="small" readOnly />
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {comment.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body1">{comment.content}</Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Box sx={{ position: 'sticky', top: 20 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={`https://source.unsplash.com/random/100x100/?chef`}
                alt={recipe.createdBy || "Chef"}
                sx={{ width: 56, height: 56, mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{recipe.createdBy || "Chef"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Recipe Creator
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<PersonAdd />}
              sx={{ mb: 2 }}
            >
              Follow
            </Button>
            <Typography variant="body2" color="text.secondary">
              Chef specializing in homestyle cuisine with a modern twist. 
              Passionate about using fresh, seasonal ingredients.
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Recipe Actions
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Button
                variant={isLiked ? "contained" : "outlined"}
                color="primary"
                startIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
                onClick={handleLikeRecipe}
              >
                {isLiked ? "Liked" : "Like"} ({recipe.likes || 0})
              </Button>
              
              <Button
                variant={isSaved ? "contained" : "outlined"}
                color="secondary"
                startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                onClick={handleSaveRecipe}
              >
                {isSaved ? "Saved" : "Save"}
              </Button>
            </Box>
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Share />}
              sx={{ mb: 2 }}
            >
              Share Recipe
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Edit />}
              fullWidth
              onClick={handleEditRecipe}
              sx={{ mb: 2 }}
            >
              Edit Recipe
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              fullWidth
              onClick={handleDeleteDialogOpen}
            >
              Delete Recipe
            </Button>
          </Paper>
          
          {recipe.tags && recipe.tags.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                More Like This
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {recipe.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    clickable 
                    onClick={() => navigate(`/recipes/tag/${tag}`)} 
                  />
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </Grid>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Recipe
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this recipe? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteRecipe} 
            color="error" 
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Delete />}
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar 
        open={alertOpen} 
        autoHideDuration={4000} 
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setAlertOpen(false)} severity={alertSeverity} variant="filled">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default RecipeDetailPage; 