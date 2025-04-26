import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Avatar, 
  Box, 
  Chip,
  Button,
  IconButton,
  InputBase,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Rating,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Favorite,
  Share,
  PersonAdd,
  FilterList
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import RecipeService from '../services/recipeService';

// Mock data
const recipesData = [
  {
    id: 1,
    title: 'Homemade Pasta Carbonara',
    chef: 'Jamie Oliver',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef1',
    image: 'https://source.unsplash.com/random/400x300/?pasta',
    difficulty: 'Intermediate',
    prepTime: '30 min',
    cookTime: '15 min',
    cuisine: 'Italian',
    rating: 4.8,
    reviewCount: 237,
    likes: 852,
    saved: true
  },
  {
    id: 2,
    title: 'Perfect Steak with Red Wine Sauce',
    chef: 'Gordon Ramsay',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef2',
    image: 'https://source.unsplash.com/random/400x300/?steak',
    difficulty: 'Intermediate',
    prepTime: '15 min',
    cookTime: '20 min',
    cuisine: 'French',
    rating: 4.9,
    reviewCount: 348,
    likes: 1024,
    saved: false
  },
  {
    id: 3,
    title: 'Vegan Buddha Bowl',
    chef: 'Ella Mills',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef3',
    image: 'https://source.unsplash.com/random/400x300/?bowl',
    difficulty: 'Easy',
    prepTime: '20 min',
    cookTime: '10 min',
    cuisine: 'Vegan',
    rating: 4.7,
    reviewCount: 182,
    likes: 645,
    saved: false
  },
  {
    id: 4,
    title: 'Authentic Thai Green Curry',
    chef: 'Pailin Chongchitnant',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef4',
    image: 'https://source.unsplash.com/random/400x300/?curry',
    difficulty: 'Intermediate',
    prepTime: '25 min',
    cookTime: '30 min',
    cuisine: 'Thai',
    rating: 4.6,
    reviewCount: 206,
    likes: 738,
    saved: true
  },
  {
    id: 5,
    title: 'Classic French Croissants',
    chef: 'Claire Saffitz',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef5',
    image: 'https://source.unsplash.com/random/400x300/?croissant',
    difficulty: 'Advanced',
    prepTime: '1 hr',
    cookTime: '30 min',
    cuisine: 'French',
    rating: 4.9,
    reviewCount: 412,
    likes: 1254,
    saved: false
  },
  {
    id: 6,
    title: 'Japanese Teriyaki Chicken',
    chef: 'Rie McClenny',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef6',
    image: 'https://source.unsplash.com/random/400x300/?teriyaki',
    difficulty: 'Easy',
    prepTime: '15 min',
    cookTime: '25 min',
    cuisine: 'Japanese',
    rating: 4.5,
    reviewCount: 189,
    likes: 692,
    saved: false
  },
  {
    id: 7,
    title: 'Vegetarian Stuffed Bell Peppers',
    chef: 'Molly Baz',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef7',
    image: 'https://source.unsplash.com/random/400x300/?peppers',
    difficulty: 'Easy',
    prepTime: '20 min',
    cookTime: '40 min',
    cuisine: 'Mediterranean',
    rating: 4.6,
    reviewCount: 163,
    likes: 542,
    saved: true
  },
  {
    id: 8,
    title: 'Homemade Sourdough Bread',
    chef: 'Brad Leone',
    chefAvatar: 'https://source.unsplash.com/random/40x40/?chef8',
    image: 'https://source.unsplash.com/random/400x300/?sourdough',
    difficulty: 'Advanced',
    prepTime: '2 hr',
    cookTime: '45 min',
    cuisine: 'European',
    rating: 4.8,
    reviewCount: 289,
    likes: 983,
    saved: false
  }
];

const cuisines = ['All', 'Italian', 'French', 'Thai', 'Japanese', 'Mediterranean', 'Vegan', 'European'];
const difficulties = ['All', 'Easy', 'Intermediate', 'Advanced'];
const timeOptions = ['All', 'Under 30 min', '30-60 min', 'Over 60 min'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  border: '1px solid #e0e0e0',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const RecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cuisine, setCuisine] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [time, setTime] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const recipesPerPage = 8;

  // Fetch recipes when component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await RecipeService.getAllRecipes();
        setRecipes(data);
        // Initialize saved recipes - this would come from user preferences in a real app
        setSavedRecipes([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Effect for search
  useEffect(() => {
    const searchRecipes = async () => {
      if (!searchQuery.trim()) return;
      
      try {
        setLoading(true);
        const data = await RecipeService.searchRecipes(searchQuery);
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error searching recipes:', err);
        setError('Failed to search recipes. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchRecipes();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const handleSaveRecipe = (recipeId) => {
    if (savedRecipes.includes(recipeId)) {
      setSavedRecipes(savedRecipes.filter(id => id !== recipeId));
    } else {
      setSavedRecipes([...savedRecipes, recipeId]);
    }
    // In a real app, you would save this preference to the backend
  };
  
  // Apply filters
  useEffect(() => {
    const applyFilters = async () => {
      // Skip filtering if no filters are applied and no search query
      if (cuisine === 'All' && difficulty === 'All' && time === 'All' && !searchQuery.trim()) {
        try {
          setLoading(true);
          const data = await RecipeService.getAllRecipes();
          setRecipes(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching recipes:', err);
          setError('Failed to load recipes. Please try again later.');
        } finally {
          setLoading(false);
        }
        return;
      }
      
      // For tag filtering (cuisine)
      if (cuisine !== 'All') {
        try {
          setLoading(true);
          const data = await RecipeService.getRecipesByTag(cuisine);
          
          // Apply additional client-side filtering for difficulty and time
          let filteredData = [...data];
          
          if (difficulty !== 'All') {
            filteredData = filteredData.filter(recipe => recipe.difficulty === difficulty);
          }
          
          if (time !== 'All') {
            filteredData = applyTimeFilter(filteredData);
          }
          
          setRecipes(filteredData);
          setError(null);
        } catch (err) {
          console.error('Error fetching recipes by tag:', err);
          setError('Failed to filter recipes. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        // Apply client-side filtering only for difficulty and time
        try {
          setLoading(true);
          const data = await RecipeService.getAllRecipes();
          
          let filteredData = [...data];
          
          if (difficulty !== 'All') {
            filteredData = filteredData.filter(recipe => recipe.difficulty === difficulty);
          }
          
          if (time !== 'All') {
            filteredData = applyTimeFilter(filteredData);
          }
          
          setRecipes(filteredData);
          setError(null);
        } catch (err) {
          console.error('Error fetching and filtering recipes:', err);
          setError('Failed to filter recipes. Please try again later.');
        } finally {
          setLoading(false);
        }
      }
    };
    
    applyFilters();
  }, [cuisine, difficulty, time]);
  
  // Helper function to apply time filter
  const applyTimeFilter = (data) => {
    return data.filter(recipe => {
      const totalTime = recipe.preparationTimeMinutes + recipe.cookingTimeMinutes;
      
      if (time === 'Under 30 min') {
        return totalTime < 30;
      } else if (time === '30-60 min') {
        return totalTime >= 30 && totalTime <= 60;
      } else if (time === 'Over 60 min') {
        return totalTime > 60;
      }
      
      return true;
    });
  };
  
  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Paginate the recipes
  const displayedRecipes = recipes.slice(
    (page - 1) * recipesPerPage,
    page * recipesPerPage
  );
  
  const pageCount = Math.ceil(recipes.length / recipesPerPage);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Discover Recipes
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Browse professional recipes from top chefs or share your own culinary creations with the community.
      </Typography>
      
      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search recipes, chefs, cuisines..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearch}
              />
            </Search>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="cuisine-label">Cuisine</InputLabel>
                <Select
                  labelId="cuisine-label"
                  id="cuisine-select"
                  value={cuisine}
                  label="Cuisine"
                  onChange={(e) => setCuisine(e.target.value)}
                >
                  {cuisines.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  id="difficulty-select"
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  {difficulties.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="time-label">Time</InputLabel>
                <Select
                  labelId="time-label"
                  id="time-select"
                  value={time}
                  label="Time"
                  onChange={(e) => setTime(e.target.value)}
                >
                  {timeOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="contained"
                component={Link}
                to="/recipes/add"
                sx={{ ml: { xs: 0, md: 'auto' } }}
              >
                Add New Recipe
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {/* Recipe Grid */}
      {!loading && !error && (
        <Grid container spacing={3}>
          {displayedRecipes.length > 0 ? (
            displayedRecipes.map((recipe) => (
              <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={recipe.imageUrl || `https://source.unsplash.com/random/400x300/?food`}
                    alt={recipe.title}
                    sx={{ position: 'relative' }}
                  />
                  
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      right: 10, 
                      backgroundColor: 'rgba(255,255,255,0.8)',
                      borderRadius: '50%',
                      p: 0.5
                    }}
                  >
                    <IconButton 
                      size="small" 
                      onClick={() => handleSaveRecipe(recipe.id)}
                      sx={{ color: savedRecipes.includes(recipe.id) ? 'primary.main' : 'text.secondary' }}
                    >
                      {savedRecipes.includes(recipe.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                  </Box>
                  
                  {recipe.tags && recipe.tags.length > 0 && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        top: 140, 
                        left: 16,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {recipe.tags[0]}
                    </Box>
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                    <Typography variant="h6" component={Link} to={`/recipes/${recipe.id}`} sx={{ textDecoration: 'none', color: 'text.primary' }}>
                      {recipe.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Avatar 
                        sx={{ width: 24, height: 24, mr: 1 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {recipe.createdBy || "Chef"}
                      </Typography>
                      <IconButton size="small" sx={{ ml: 'auto' }}>
                        <PersonAdd fontSize="small" />
                      </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Rating value={4.5} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        (120)
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
                      <Chip 
                        label={recipe.difficulty} 
                        size="small"
                        sx={{ 
                          backgroundColor: 
                            recipe.difficulty === 'Easy' ? 'success.light' : 
                            recipe.difficulty === 'Intermediate' ? 'warning.light' : 
                            'error.light',
                          color: 'white',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      <Chip
                        label={`Prep: ${recipe.preparationTimeMinutes} min`}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                      <Chip
                        label={`Cook: ${recipe.cookingTimeMinutes} min`}
                        size="small"
                        sx={{ fontSize: '0.7rem', height: 20 }}
                      />
                    </Box>
                  </CardContent>
                  
                  <Divider />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Favorite fontSize="small" color="error" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {recipe.likes || 0}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', ml: 'auto' }}>
                      <IconButton size="small">
                        <Share fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  No recipes match your search criteria
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setCuisine('All');
                    setDifficulty('All');
                    setTime('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
      
      {/* Pagination */}
      {!loading && !error && recipes.length > recipesPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="primary" 
            showFirstButton 
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default RecipesPage; 