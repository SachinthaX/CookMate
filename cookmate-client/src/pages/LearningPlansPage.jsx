import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Button, 
  Chip,
  Avatar,
  AvatarGroup,
  LinearProgress,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Rating,
  Divider,
  IconButton,
  Badge,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Search as SearchIcon, 
  School,
  BookmarkBorder,
  Bookmark,
  Share,
  Person,
  Add
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import LearningPlanService from '../services/learningPlanService';

// Placeholder data that will be used if API fails
const fallbackData = [
  {
    id: 1,
    title: 'Italian Cuisine Mastery',
    author: 'Marco Rossi',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef1',
    image: 'https://source.unsplash.com/random/600x400/?italian',
    description: 'Master the fundamentals of Italian cooking with this comprehensive learning plan. From pasta making to regional specialties.',
    steps: 12,
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Regional Cuisine',
    rating: 4.8,
    reviewCount: 342,
    enrolled: 1245,
    completed: 78,
    saved: false
  },
  {
    id: 2,
    title: 'Knife Skills Advanced',
    author: 'Erica Chen',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef2',
    image: 'https://source.unsplash.com/random/600x400/?knife',
    description: 'Take your knife skills to the next level with professional techniques. Learn precision cutting, speed, and safety.',
    steps: 8,
    duration: '4 weeks',
    level: 'Advanced',
    category: 'Techniques',
    rating: 4.9,
    reviewCount: 218,
    enrolled: 876,
    completed: 92,
    saved: true
  },
  {
    id: 3,
    title: 'Baking Fundamentals',
    author: 'Claire Johnson',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef3',
    image: 'https://source.unsplash.com/random/600x400/?baking',
    description: 'Learn essential baking techniques and the science behind perfect breads, cakes, and pastries.',
    steps: 15,
    duration: '8 weeks',
    level: 'Beginner',
    category: 'Baking',
    rating: 4.7,
    reviewCount: 456,
    enrolled: 2145,
    completed: 65,
    saved: false
  },
  {
    id: 4,
    title: 'Plant-Based Cooking',
    author: 'Maya Greene',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef4',
    image: 'https://source.unsplash.com/random/600x400/?vegan',
    description: 'Explore the world of plant-based cooking with creative recipes and techniques to maximize flavor without animal products.',
    steps: 10,
    duration: '5 weeks',
    level: 'Intermediate',
    category: 'Specialty Diets',
    rating: 4.6,
    reviewCount: 312,
    enrolled: 987,
    completed: 73,
    saved: true
  },
  {
    id: 5,
    title: 'French Pastry Techniques',
    author: 'Jean-Pierre Blanc',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef5',
    image: 'https://source.unsplash.com/random/600x400/?pastry',
    description: 'Master the art of French pastry with classic techniques and recipes from a professional pastry chef.',
    steps: 14,
    duration: '10 weeks',
    level: 'Advanced',
    category: 'Baking',
    rating: 4.9,
    reviewCount: 276,
    enrolled: 754,
    completed: 88,
    saved: false
  },
  {
    id: 6,
    title: 'Asian Fusion Techniques',
    author: 'Li Wong',
    authorAvatar: 'https://source.unsplash.com/random/40x40/?chef6',
    image: 'https://source.unsplash.com/random/600x400/?asian',
    description: 'Blend culinary traditions from across Asia with modern techniques to create innovative fusion dishes.',
    steps: 12,
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Regional Cuisine',
    rating: 4.7,
    reviewCount: 198,
    enrolled: 823,
    completed: 70,
    saved: false
  }
];

const categories = ['All', 'Regional Cuisine', 'Techniques', 'Baking', 'Specialty Diets'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const LearningPlansPage = () => {
  const [learningPlans, setLearningPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [tabValue, setTabValue] = useState(0);
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  
  // Fetch learning plans from API
  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        setLoading(true);
        const data = await LearningPlanService.getAllLearningPlans();
        
        // Transform data to match our component's expected format
        const formattedData = data.map(plan => ({
          id: plan.id,
          title: plan.title,
          description: plan.description,
          // If your API doesn't provide these fields, you can add placeholders
          author: plan.authorName || 'Unknown Author',
          authorAvatar: plan.authorAvatar || `https://source.unsplash.com/random/40x40/?chef${Math.floor(Math.random() * 10)}`,
          image: plan.postcoverurl || `https://source.unsplash.com/random/600x400/?cooking${Math.floor(Math.random() * 10)}`,
          steps: plan.steps ? plan.steps.length : 0,
          duration: plan.duration || `${Math.floor(Math.random() * 10) + 1} weeks`,
          level: plan.level || 'Intermediate',
          category: plan.category || 'Uncategorized',
          rating: plan.rating || (3 + Math.random() * 2).toFixed(1),
          reviewCount: plan.reviewCount || Math.floor(Math.random() * 500),
          enrolled: plan.enrolled || Math.floor(Math.random() * 2000),
          progress: plan.progress || 0,
          completed: plan.completed || false,
          saved: false // We'll determine this from user preferences
        }));
        
        setLearningPlans(formattedData);
        
        // Get saved plans for current user
        // This would typically come from user preferences in your backend
        // For now, we'll just mark a few random ones as saved
        const savedIds = formattedData
          .filter(() => Math.random() > 0.6)
          .map(plan => plan.id);
        setSavedPlans(savedIds);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch learning plans:', err);
        setError('Failed to load learning plans. Using fallback data.');
        // Use fallback data if API call fails
        setLearningPlans(fallbackData);
        setSavedPlans(fallbackData.filter(plan => plan.saved).map(plan => plan.id));
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSavePlan = async (planId) => {
    try {
      const isSaved = savedPlans.includes(planId);
      
      // In a real app, you would call an API to save/unsave the plan
      // For now, we're just updating the UI state
      if (isSaved) {
        setSavedPlans(savedPlans.filter(id => id !== planId));
        setSnackbar({
          open: true,
          message: 'Learning plan removed from saved items',
          severity: 'info'
        });
      } else {
        setSavedPlans([...savedPlans, planId]);
        setSnackbar({
          open: true,
          message: 'Learning plan saved successfully',
          severity: 'success'
        });
      }
      
      // In a real implementation, you would also update this on the server
      // await userPreferencesService.updateSavedPlans(userId, planId, !isSaved);
      
    } catch (err) {
      console.error('Error saving learning plan:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update saved status',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };
  
  const filteredPlans = learningPlans.filter(plan => {
    const matchesSearch = searchTerm === '' || 
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.author.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = selectedCategory === 'All' || plan.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || plan.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });
  
  const displayedPlans = tabValue === 0 
    ? filteredPlans 
    : filteredPlans.filter(plan => savedPlans.includes(plan.id));

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        Learning Plans
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Enhance your culinary skills with structured learning plans created by professional chefs and cooking instructors.
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9} lg={10}>
            <Paper 
              component="form"
              sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <IconButton sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search learning plans, instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <Box sx={{ display: 'flex', gap: 1, px: 1 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{ 
                      border: 'none', 
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      marginLeft: '4px',
                      color: '#666'
                    }}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </Box>
                
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Level
                  </Typography>
                  <select 
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    style={{ 
                      border: 'none', 
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      marginLeft: '4px',
                      color: '#666'
                    }}
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3} lg={2}>
            <Button 
              variant="contained" 
              startIcon={<Add />}
              component={Link}
              to="/learning-plans/create"
              fullWidth
              sx={{
                height: '100%',
                py: 1
              }}
            >
              Create Learning Plan
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ mb: 3 }}
      >
        <Tab label="All Learning Plans" />
        <Tab 
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <span>Saved Plans</span>
              <Badge 
                badgeContent={savedPlans.length} 
                color="primary"
                sx={{ ml: 1 }}
              />
            </Box>
          } 
        />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedPlans.length > 0 ? (
        <Grid container spacing={3}>
          {displayedPlans.map(plan => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={plan.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={plan.image}
                  alt={plan.title}
                  sx={{
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://source.unsplash.com/random/600x400/?cooking';
                  }}
                />
                <Box sx={{ position: 'relative', mt: -3, mx: 2 }}>
                  <Chip 
                    label={plan.level} 
                    size="small"
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {plan.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={() => handleSavePlan(plan.id)}
                      color="primary"
                    >
                      {savedPlans.includes(plan.id) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      src={plan.authorAvatar} 
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {plan.author}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {plan.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={Number(plan.rating)} precision={0.1} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({plan.reviewCount})
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {plan.steps} lessons
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      {plan.enrolled} enrolled
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={plan.progress || 0} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
                    <Chip 
                      label={plan.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.08)',
                        fontSize: '0.7rem'
                      }}
                    />
                    <Chip 
                      label={plan.duration} 
                      size="small"
                      icon={<School sx={{ fontSize: '1rem !important' }} />}
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.08)',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                </CardContent>
                <Button 
                  component={Link}
                  to={`/learning-plans/${plan.id}`}
                  variant="contained" 
                  sx={{ 
                    mx: 2, 
                    mb: 2, 
                    borderRadius: 6,
                    fontWeight: 'bold'
                  }}
                >
                  View Plan
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No learning plans found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 0 
              ? 'Try adjusting your search or filters' 
              : 'You have no saved learning plans yet'}
          </Typography>
        </Box>
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LearningPlansPage;