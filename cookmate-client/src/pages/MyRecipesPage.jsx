import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Rating,
  Divider,
  useTheme,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  Favorite,
  FavoriteOutlined,
  Edit,
  Delete,
  MoreVert,
  Add as AddIcon,
  FilterList
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import RecipeService from '../services/recipeService';

const MyRecipesPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's recipes
  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!isAuthenticated || !currentUser?.id) {
        setError('You need to be logged in to view your recipes');
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { state: { from: '/my-recipes' } });
        }, 1500);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching recipes for user:', currentUser.id);
        const userRecipes = await RecipeService.getRecipesByUser(currentUser.id);
        console.log('Fetched recipes:', userRecipes.length);
        setRecipes(userRecipes);
      } catch (err) {
        console.error('Error fetching user recipes:', err);
        setError('Failed to load your recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRecipes();
  }, [currentUser, isAuthenticated, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter recipes based on tab selection (all, published, drafts)
  const filteredRecipes = tabValue === 0 
    ? recipes 
    : tabValue === 1 
      ? recipes.filter(recipe => recipe.published) 
      : recipes.filter(recipe => !recipe.published);

  const handleDeleteRecipe = async (id) => {
    if (!id) return;

    try {
      await RecipeService.deleteRecipe(id);
      setRecipes(recipes.filter(recipe => recipe.id !== id));
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // In a production app, these would update the backend
  const handleToggleSaved = (id) => {
    setRecipes(recipes.map(recipe => 
      recipe.id === id ? {...recipe, saved: !recipe.saved} : recipe
    ));
  };

  const handleToggleLike = (id) => {
    setRecipes(recipes.map(recipe => {
      if (recipe.id === id) {
        const newLikes = recipe.likes + (recipe.liked ? -1 : 1);
        return {...recipe, likes: newLikes, liked: !recipe.liked};
      }
      return recipe;
    }));
  };

  return (
    <Box sx={{ 
      width: '100%',
      px: 0,
      py: 0,
      bgcolor: '#f8f9fa'
    }}>
      {/* Hero Section */}
      <Box sx={{ 
        p: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
        color: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
        mb: 3
      }}>
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            My Culinary Collection
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.9 }}>
            Manage, share, and get inspired by your personal recipe creations
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<AddIcon />}
              component={Link}
              to="/recipes/add"
              sx={{ 
                bgcolor: 'white', 
                color: '#0077B5',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Create New Recipe
            </Button>
            <Button 
              variant="outlined" 
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)',
                }
              }}
              startIcon={<FilterList />}
            >
              Filter Recipes
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 3 } }}>
        {/* Tabs Section */}
        <Paper sx={{ 
          mb: 3, 
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                py: 1.5,
                textTransform: 'capitalize',
                fontSize: '1rem'
              }
            }}
          >
            <Tab label={`All Recipes (${recipes.length})`} />
            <Tab label={`Published (${recipes.filter(r => r.published).length})`} />
            <Tab label={`Drafts (${recipes.filter(r => !r.published).length})`} />
          </Tabs>
        </Paper>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {!loading && recipes.length === 0 && !error && (
          <Box sx={{ 
            textAlign: 'center',
            py: 5,
            px: 3,
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't created any recipes yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Start your culinary journey by creating your first recipe
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />}
              component={Link}
              to="/recipes/add"
            >
              Create Your First Recipe
            </Button>
          </Box>
        )}

        {/* Recipe Grid */}
        {!loading && filteredRecipes.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {filteredRecipes.map((recipe) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                  }
                }}>
                  {/* Recipe Image with Badge if draft */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={recipe.imageUrl || 'https://source.unsplash.com/random/300x200/?food'}
                      alt={recipe.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    {!recipe.published && (
                      <Chip
                        label="Draft"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom noWrap>
                      {recipe.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        value={recipe.rating || 0} 
                        precision={0.5} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({recipe.reviewCount || 0})
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {recipe.description && recipe.description.length > 100 
                        ? `${recipe.description.substring(0, 100)}...` 
                        : recipe.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {recipe.tags && recipe.tags.map((tag, index) => (
                        <Chip 
                          key={index} 
                          label={tag} 
                          size="small" 
                          sx={{ 
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.contrastText,
                            fontSize: '0.7rem'
                          }} 
                        />
                      ))}
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Created: {recipe.createdAt || 'Recently'}
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last edited: {recipe.updatedAt || 'Not edited'}
                    </Typography>
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                    <Box>
                      <IconButton 
                        aria-label="Edit recipe"
                        component={Link}
                        to={`/recipes/edit/${recipe.id}`}
                        size="small"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton 
                        aria-label="Delete recipe" 
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        size="small"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box>
                      <IconButton 
                        aria-label={recipe.liked ? 'Unlike' : 'Like'} 
                        onClick={() => handleToggleLike(recipe.id)}
                        size="small"
                        color={recipe.liked ? 'error' : 'default'}
                      >
                        {recipe.liked ? <Favorite fontSize="small" /> : <FavoriteOutlined fontSize="small" />}
                      </IconButton>
                      <IconButton 
                        aria-label={recipe.saved ? 'Unsave' : 'Save'} 
                        onClick={() => handleToggleSaved(recipe.id)}
                        size="small"
                        color={recipe.saved ? 'primary' : 'default'}
                      >
                        {recipe.saved ? <Bookmark fontSize="small" /> : <BookmarkBorder fontSize="small" />}
                      </IconButton>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default MyRecipesPage; 