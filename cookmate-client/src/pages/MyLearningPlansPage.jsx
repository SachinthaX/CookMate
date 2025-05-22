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
  LinearProgress,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  PlayArrow,
  Delete,
  MoreVert,
  AccessTime,
  School,
  Add as AddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LearningPlanService from '../services/learningPlanService';

const MyLearningPlansPage = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [learningPlans, setLearningPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's learning plans
  useEffect(() => {
    const fetchUserLearningPlans = async () => {
      if (!isAuthenticated || !currentUser?.id) {
        setError('You need to be logged in to view your learning plans');
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { state: { from: '/my-learning-plans' } });
        }, 1500);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching learning plans for user:', currentUser.id);
        const userLearningPlans = await LearningPlanService.getLearningPlansByUser(currentUser.id);
        console.log('Fetched learning plans:', userLearningPlans.length);
        
        // Enhance the data with required display properties if needed
        const enhancedPlans = userLearningPlans.map(plan => ({
          ...plan,
          active: plan.progress < 100, // Consider a plan active if not completed
          saved: plan.saved || false,  // Default to false if not specified
          totalSteps: plan.steps?.length || 0,
          completedSteps: plan.steps?.filter(step => step.completed).length || 0
        }));
        
        setLearningPlans(enhancedPlans);
      } catch (err) {
        console.error('Error fetching user learning plans:', err);
        setError('Failed to load your learning plans. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLearningPlans();
  }, [currentUser, isAuthenticated, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredLearningPlans = tabValue === 0 
    ? learningPlans 
    : tabValue === 1 
      ? learningPlans.filter(plan => plan.active) 
      : learningPlans.filter(plan => plan.progress === 100);

  const handleDeletePlan = async (id) => {
    if (!id) return;
    
    try {
      await LearningPlanService.deleteLearningPlan(id);
      setLearningPlans(learningPlans.filter(plan => plan.id !== id));
    } catch (error) {
      console.error('Error deleting learning plan:', error);
      setError('Failed to delete the learning plan. Please try again.');
    }
  };

  const handleToggleSaved = (id) => {
    // In a real app, would update backend
    setLearningPlans(learningPlans.map(plan => 
      plan.id === id ? {...plan, saved: !plan.saved} : plan
    ));
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          My Learning Plans
        </Typography>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link}
            to="/learning-plans/create"
            sx={{ mr: 2 }}
            startIcon={<AddIcon />}
          >
            Create Plan
          </Button>
          <Button 
            variant="outlined" 
            color="primary"
            component={Link}
            to="/learning-plans"
          >
            Explore Plans
          </Button>
        </Box>
      </Box>

      <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`All Plans (${learningPlans.length})`} />
          <Tab label={`In Progress (${learningPlans.filter(plan => plan.active).length})`} />
          <Tab label={`Completed (${learningPlans.filter(plan => plan.progress === 100).length})`} />
        </Tabs>
      </Paper>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Empty state */}
      {!loading && learningPlans.length === 0 && !error && (
        <Box sx={{ 
          textAlign: 'center',
          py: 5,
          px: 3,
          bgcolor: '#fff',
          borderRadius: 2,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
        }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't created or enrolled in any learning plans yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start your culinary education journey by creating your first learning plan
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            component={Link}
            to="/learning-plans/create"
          >
            Create Your First Learning Plan
          </Button>
        </Box>
      )}

      {/* Learning plans grid */}
      {!loading && filteredLearningPlans.length > 0 && (
        <Grid container spacing={3}>
          {filteredLearningPlans.map((plan) => (
            <Grid item xs={12} sm={6} md={4} key={plan.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={plan.image || 'https://source.unsplash.com/random/300x200/?cooking'}
                  alt={plan.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {plan.title}
                    </Typography>
                    <IconButton size="small">
                      <MoreVert />
                    </IconButton>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {plan.description && plan.description.length > 120
                      ? `${plan.description.substring(0, 120)}...`
                      : plan.description}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="body2" fontSize="0.875rem">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontSize="0.875rem" fontWeight="bold">
                        {plan.progress || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={plan.progress || 0} 
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {plan.completedSteps || 0} of {plan.totalSteps || 0} steps completed
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {plan.level && (
                      <Chip 
                        icon={<School fontSize="small" />} 
                        label={plan.level} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                    {plan.duration && (
                      <Chip 
                        icon={<AccessTime fontSize="small" />} 
                        label={plan.duration} 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(plan.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
                  <Box>
                    <Button 
                      variant="contained" 
                      size="small" 
                      startIcon={<PlayArrow />}
                      disabled={plan.progress === 100}
                      component={Link}
                      to={`/learning-plans/${plan.id}`}
                    >
                      {plan.progress === 0 ? 'Start' : plan.progress === 100 ? 'Completed' : 'Continue'}
                    </Button>
                  </Box>
                  <Box>
                    <IconButton 
                      aria-label="bookmark"
                      onClick={() => handleToggleSaved(plan.id)}
                      color={plan.saved ? 'primary' : 'default'}
                    >
                      {plan.saved ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                    <IconButton 
                      aria-label="delete"
                      onClick={() => handleDeletePlan(plan.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MyLearningPlansPage; 