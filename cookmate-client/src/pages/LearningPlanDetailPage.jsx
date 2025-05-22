import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Button,
  Avatar,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Card,
  CardContent,
  Rating,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Skeleton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  AccessTime,
  CheckCircle,
  Restaurant,
  VideoLibrary,
  QuestionAnswer,
  MenuBook,
  Share,
  Bookmark,
  BookmarkBorder,
  PlayArrow,
  Person,
  PersonAdd,
  School,
  ArrowBack,
  Edit,
  Delete
} from '@mui/icons-material';
import LearningPlanService from '../services/learningPlanService';
import LearningStepService from '../services/learningStepService';
import { useAuth } from '../context/AuthContext';

// Fallback data in case the API fails
const fallbackData = {
  id: 1,
  title: 'Italian Cuisine Mastery',
  author: 'Marco Rossi',
  authorAvatar: 'https://source.unsplash.com/random/40x40/?chef1',
  authorTitle: 'Master Chef, Culinary Instructor',
  description: 'Master the fundamentals of Italian cooking with this comprehensive learning plan. From pasta making to regional specialties, this plan covers everything you need to know to create authentic Italian dishes at home.',
  image: 'https://source.unsplash.com/random/1200x600/?italian',
  level: 'Intermediate',
  duration: '6 weeks',
  hoursPerWeek: 4,
  rating: 4.8,
  reviewCount: 342,
  enrolled: 1245,
  completion: 65,
  createdAt: '3 months ago',
  updatedAt: '2 weeks ago',
  requirements: [
    'Basic cooking skills',
    'Access to common kitchen tools',
    'Familiarity with basic Italian ingredients'
  ],
  steps: [
    {
      id: 1,
      title: 'Introduction to Italian Cuisine',
      type: 'video',
      duration: '35 min',
      description: 'An overview of Italian culinary traditions, regional differences, and the importance of fresh ingredients.',
      completed: true,
      resources: [
        { type: 'video', title: 'History of Italian Cooking', duration: '15 min' },
        { type: 'reading', title: 'Italian Pantry Essentials', length: '5 pages' }
      ]
    },
    {
      id: 2,
      title: 'Pasta Making Fundamentals',
      type: 'practical',
      duration: '1.5 hours',
      description: 'Learn to make fresh pasta from scratch, including different shapes and variations.',
      completed: true,
      resources: [
        { type: 'video', title: 'Hand-rolled Pasta Techniques', duration: '25 min' },
        { type: 'recipe', title: 'Basic Egg Pasta Dough', ingredients: 8 }
      ]
    },
    {
      id: 3,
      title: 'Classic Sauce Preparation',
      type: 'practical',
      duration: '2 hours',
      description: 'Master the five mother sauces of Italian cuisine, from simple marinara to complex ragù.',
      completed: true,
      resources: [
        { type: 'video', title: 'Perfecting Tomato Sauce', duration: '18 min' },
        { type: 'recipe', title: 'Traditional Bolognese Ragù', ingredients: 12 }
      ]
    },
    {
      id: 4,
      title: 'Regional Specialties: Northern Italy',
      type: 'practical',
      duration: '3 hours',
      description: 'Explore the rich, creamy dishes of Northern Italian cuisine, including risotto and polenta.',
      completed: false,
      resources: [
        { type: 'video', title: 'Risotto Techniques', duration: '22 min' },
        { type: 'quiz', title: 'Northern Italian Ingredients', questions: 10 }
      ]
    },
    {
      id: 5,
      title: 'Regional Specialties: Southern Italy',
      type: 'practical',
      duration: '3 hours',
      description: 'Discover the vibrant, bold flavors of Southern Italian cooking, with an emphasis on seafood and vegetables.',
      completed: false,
      resources: [
        { type: 'video', title: 'Sicilian Cooking Methods', duration: '20 min' },
        { type: 'recipe', title: 'Authentic Neapolitan Pizza', ingredients: 6 }
      ]
    },
    {
      id: 6,
      title: 'Desserts and Pastries',
      type: 'practical',
      duration: '2.5 hours',
      description: 'Learn to create classic Italian desserts from tiramisu to panna cotta and cannoli.',
      completed: false,
      resources: [
        { type: 'video', title: 'Tiramisu Masterclass', duration: '15 min' },
        { type: 'recipe', title: 'Perfect Panna Cotta', ingredients: 5 }
      ]
    }
  ],
  reviews: [
    {
      id: 1,
      user: 'Emma Wilson',
      avatar: 'https://source.unsplash.com/random/40x40/?woman',
      date: '2 weeks ago',
      rating: 5,
      content: 'This learning plan completely transformed my approach to Italian cooking. The pasta making section alone was worth the investment. Highly recommended!'
    },
    {
      id: 2,
      user: 'James Cooper',
      avatar: 'https://source.unsplash.com/random/40x40/?man',
      date: '1 month ago',
      rating: 4,
      content: 'Very comprehensive coverage of Italian cuisine. I especially enjoyed the regional specialties sections. My only criticism would be that some of the ingredients were hard to source.'
    },
    {
      id: 3,
      user: 'Sofia Garcia',
      avatar: 'https://source.unsplash.com/random/40x40/?woman2',
      date: '2 months ago',
      rating: 5,
      content: 'Marco is an excellent instructor. His clear explanations and demonstrations made even complex techniques seem approachable. I\'ve already impressed my family with several dishes from this plan!'
    }
  ]
};

const LearningPlanDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [learningPlan, setLearningPlan] = useState(null);
  const [learningSteps, setLearningSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stepsLoading, setStepsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Fetch learning plan details
  useEffect(() => {
    const fetchLearningPlan = async () => {
      try {
        setLoading(true);
        const planData = await LearningPlanService.getLearningPlanById(id);
        
        console.log('Fetched learning plan data:', planData);
        
        // Transform data if needed
        setLearningPlan({
          ...planData,
          // Use authorName from backend or fallback to 'Unknown Author'
          author: planData.authorName || planData.author || 'Unknown Author',
          // Add any missing fields with defaults
          authorAvatar: planData.authorAvatar || 'https://source.unsplash.com/random/40x40/?chef',
          authorTitle: planData.authorTitle || 'Culinary Instructor',
          // Use postcoverurl from backend or fallback to random image
          postcoverurl: planData.postcoverurl || 'https://source.unsplash.com/random/1200x600/?cooking',
          level: planData.level || 'Intermediate',
          duration: planData.duration || '4 weeks',
          hoursPerWeek: planData.hoursPerWeek || 3,
          rating: planData.rating || 4.5,
          reviewCount: planData.reviewCount || 120,
          enrolled: planData.enrolled || 450,
          requirements: planData.requirements || ['Basic cooking skills'],
          // These would typically come from reviews collection
          reviews: planData.reviews || []
        });
        
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch learning plan ${id}:`, err);
        setError('Failed to load learning plan details. Using fallback data.');
        setLearningPlan(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlan();
  }, [id]);
  
  // Fetch learning steps
  useEffect(() => {
    const fetchLearningSteps = async () => {
      try {
        setStepsLoading(true);
        const stepsData = await LearningStepService.getLearningStepsByPlanId(id);
        
        // Transform and sort steps by their order
        const formattedSteps = stepsData.map(step => ({
          ...step,
          // Add any missing fields with defaults
          type: step.type || 'practical',
          duration: step.duration || '1 hour',
          resources: step.resources || []
        })).sort((a, b) => a.order - b.order);
        
        setLearningSteps(formattedSteps);
        
        // Find the first incomplete step index
        const firstIncompleteIndex = formattedSteps.findIndex(step => !step.completed);
        setActiveStep(firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0);
        
      } catch (err) {
        console.error(`Failed to fetch learning steps for plan ${id}:`, err);
        // If the API fails, use the steps from fallback data
        setLearningSteps(fallbackData.steps || []);
        setActiveStep(fallbackData.steps.findIndex(step => !step.completed));
      } finally {
        setStepsLoading(false);
      }
    };

    if (id) {
      fetchLearningSteps();
    }
  }, [id]);
  
  const handleStepClick = (step) => {
    setActiveStep(step);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSavePlan = () => {
    setIsSaved(!isSaved);
    // In a real app, would send this to the backend
    setSnackbar({
      open: true,
      message: isSaved ? 'Learning plan removed from saved items' : 'Learning plan saved successfully',
      severity: isSaved ? 'info' : 'success'
    });
  };
  
  const handleEditPlan = () => {
    navigate(`/create-learning-plan/${id}`);
  };
  
  const handleDeleteDialogOpen = () => {
    setOpenDeleteDialog(true);
  };
  
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  
  const handleDeletePlan = async () => {
    try {
      setLoading(true);
      await LearningPlanService.deleteLearningPlan(id);
      
      setSnackbar({
        open: true,
        message: 'Learning plan deleted successfully',
        severity: 'success'
      });
      
      // Navigate back to learning plans list after a short delay
      setTimeout(() => {
        navigate('/learning-plans');
      }, 1500);
      
    } catch (err) {
      console.error('Failed to delete learning plan:', err);
      setSnackbar({
        open: true,
        message: 'Failed to delete learning plan',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
    }
  };
  
  const handleStepCompletion = async (stepId, completed) => {
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      setSnackbar({
        open: true,
        message: 'You need to be logged in to track your progress',
        severity: 'error'
      });
      return;
    }
    
    try {
      // Update the UI optimistically
      setLearningSteps(learningSteps.map(step => 
        step.id === stepId ? { ...step, completed } : step
      ));
      
      // Send the update to the backend with the current user ID
      await LearningStepService.updateLearningStepCompletion(stepId, currentUser.id, completed);
      
      // Calculate new progress
      const completedCount = learningSteps.filter(step => 
        step.id === stepId ? completed : step.completed
      ).length;
      const progress = Math.round((completedCount / learningSteps.length) * 100);
      
      // Update learning plan progress
      if (learningPlan.id) {
        await LearningPlanService.updateLearningPlanProgress(learningPlan.id, progress);
      }
      
      setSnackbar({
        open: true,
        message: completed ? 'Step marked as complete' : 'Step marked as incomplete',
        severity: 'success'
      });
    } catch (err) {
      console.error('Failed to update step completion status:', err);
      
      // Revert the UI change
      setLearningSteps(learningSteps);
      
      setSnackbar({
        open: true,
        message: 'Failed to update step status',
        severity: 'error'
      });
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, open: false});
  };
  
  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2, mb: 3 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} width="60%" sx={{ mb: 3 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Box>
    );
  }
  
  if (error || !learningPlan) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Failed to load learning plan. Please try again later.'}
        </Alert>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/learning-plans')}
        >
          Back to Learning Plans
        </Button>
      </Box>
    );
  }
  
  const completedSteps = learningSteps.filter(step => step.completed).length;
  const completionPercentage = learningSteps.length > 0 
    ? (completedSteps / learningSteps.length) * 100 
    : 0;
  
  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9} lg={10}>
          <Box sx={{ position: 'relative', mb: 5 }}>
            <Box 
              sx={{ 
                height: { xs: 200, sm: 250, md: 350, lg: 400 }, 
                borderRadius: 2, 
                overflow: 'hidden', 
                position: 'relative',
                bgcolor: 'grey.200'
              }}
            >
              <img 
                src={learningPlan.postcoverurl || fallbackData.image} 
                alt={learningPlan.title} 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://source.unsplash.com/random/1200x600/?cooking';
                }}
              />
              <Box sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0, 
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                p: { xs: 2, md: 3 }
              }}>
                <Chip 
                  label={learningPlan.level} 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'primary.main',
                    fontSize: '0.85rem',
                    mb: 1
                  }}
                />
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                  {learningPlan.title}
                </Typography>
              </Box>
            </Box>
            
            <Paper sx={{ p: { xs: 2, md: 3 }, mb: 4, borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' }, 
                alignItems: { xs: 'flex-start', sm: 'center' }, 
                mb: 3 
              }}>
                <Avatar src={learningPlan.authorAvatar} sx={{ width: 60, height: 60 }} />
                <Box sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
                  <Typography variant="h6">{learningPlan.author}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {learningPlan.authorTitle}
                  </Typography>
                </Box>
                <Box sx={{ 
                  ml: { xs: 0, sm: 'auto' }, 
                  mt: { xs: 2, sm: 0 },
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1
                }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<PersonAdd />}
                  >
                    Follow
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={handleEditPlan}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleDeleteDialogOpen}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                About this Learning Plan
              </Typography>
              <Typography variant="body1" paragraph>
                {learningPlan.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <AccessTime color="primary" fontSize="large" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Duration
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {learningPlan.duration}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <School color="primary" fontSize="large" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Level
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {learningPlan.level}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Restaurant color="primary" fontSize="large" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Commitment
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {learningPlan.hoursPerWeek} hrs/week
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Person color="primary" fontSize="large" />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Enrolled
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {learningPlan.enrolled?.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              {learningPlan.requirements && learningPlan.requirements.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Requirements
                  </Typography>
                  <List disablePadding>
                    {learningPlan.requirements.map((requirement, index) => (
                      <ListItem key={index} disableGutters>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="primary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={requirement} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Learning Path
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Complete all {learningSteps.length} steps to master this learning plan
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ flex: 1, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={completionPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'grey.200'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {completedSteps}/{learningSteps.length} completed
                  </Typography>
                </Box>
              </Box>
              
              {stepsLoading ? (
                <Box sx={{ mt: 4 }}>
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1, mb: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1, mb: 2 }} />
                  <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
                </Box>
              ) : (
                <Stepper 
                  activeStep={activeStep} 
                  orientation="vertical"
                  nonLinear
                  sx={{
                    '.MuiStepLabel-root': {
                      padding: '8px 0'
                    },
                    '.MuiStepContent-root': {
                      borderLeft: '2px solid',
                      borderColor: 'divider',
                      ml: 1,
                      pl: 2,
                      pb: 3
                    }
                  }}
                >
                  {learningSteps.map((step, index) => (
                    <Step key={step.id} completed={step.completed}>
                      <StepLabel
                        optional={
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              color: step.completed ? 'text.secondary' : 'primary.main',
                              fontWeight: step.completed ? 'normal' : 'medium'
                            }}
                          >
                            {step.type === 'video' && <VideoLibrary fontSize="small" sx={{ mr: 0.5 }} />}
                            {step.type === 'practical' && <Restaurant fontSize="small" sx={{ mr: 0.5 }} />}
                            {step.type === 'quiz' && <QuestionAnswer fontSize="small" sx={{ mr: 0.5 }} />}
                            {step.type === 'reading' && <MenuBook fontSize="small" sx={{ mr: 0.5 }} />}
                            {step.duration}
                          </Typography>
                        }
                        onClick={() => handleStepClick(index)}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.02)',
                            borderRadius: 1
                          }
                        }}
                      >
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: step.completed ? 'normal' : 'bold',
                            color: step.completed ? 'text.secondary' : 'text.primary'
                          }}
                        >
                          {step.title}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                          {step.description}
                        </Typography>
                        
                        {step.resources && step.resources.length > 0 && (
                          <Box sx={{ 
                            mb: 2, 
                            p: 2, 
                            bgcolor: 'grey.50', 
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                          }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Resources
                            </Typography>
                            <List disablePadding dense>
                              {step.resources.map((resource, idx) => (
                                <ListItem key={idx} disableGutters>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    {resource.type === 'video' && <VideoLibrary fontSize="small" color="primary" />}
                                    {resource.type === 'reading' && <MenuBook fontSize="small" color="primary" />}
                                    {resource.type === 'recipe' && <Restaurant fontSize="small" color="primary" />}
                                    {resource.type === 'quiz' && <QuestionAnswer fontSize="small" color="primary" />}
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={resource.title} 
                                    secondary={
                                      resource.duration || 
                                      resource.length || 
                                      (resource.ingredients && `${resource.ingredients} ingredients`) ||
                                      (resource.questions && `${resource.questions} questions`)
                                    }
                                    primaryTypographyProps={{ fontWeight: 'medium' }}
                                  />
                                  <Button 
                                    size="small" 
                                    startIcon={resource.type === 'video' ? <PlayArrow /> : undefined}
                                    variant="outlined"
                                    sx={{ minWidth: 80 }}
                                  >
                                    {resource.type === 'video' ? 'Play' : 'View'}
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}
                        
                        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                          <Button 
                            variant={step.completed ? "outlined" : "contained"}
                            color={step.completed ? "primary" : "primary"}
                            onClick={() => handleStepCompletion(step.id, !step.completed)}
                            sx={{ fontWeight: 'medium' }}
                          >
                            {step.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                          </Button>
                          
                          {index < learningSteps.length - 1 && (
                            <Button 
                              variant="outlined"
                              onClick={() => handleStepClick(index + 1)}
                            >
                              Next Step
                            </Button>
                          )}
                        </Box>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              )}
            </Paper>
            
            {learningPlan.reviews && learningPlan.reviews.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Reviews
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={learningPlan.rating} precision={0.1} readOnly />
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {learningPlan.rating} ({learningPlan.reviewCount} reviews)
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />
                
                {learningPlan.reviews.map(review => (
                  <Box key={review.id} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', mb: 1 }}>
                      <Avatar src={review.avatar} sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1">{review.user}</Typography>
                        <Typography variant="caption" color="text.secondary">{review.date}</Typography>
                      </Box>
                      <Rating value={review.rating} size="small" readOnly sx={{ ml: 'auto' }} />
                    </Box>
                    <Typography variant="body2">{review.content}</Typography>
                    {review.id !== learningPlan.reviews.length && <Divider sx={{ mt: 3 }} />}
                  </Box>
                ))}
                
                <Button variant="outlined" fullWidth>
                  Read All Reviews
                </Button>
              </Paper>
            )}
          </Box>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={3} lg={2}>
          <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Progress
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      flex: 1,
                      mr: 2
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(completionPercentage)}%
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {completedSteps}/{learningSteps.length} steps
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated {learningPlan.updatedAt || 'recently'}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  sx={{ mb: 2 }}
                  onClick={() => handleStepClick(activeStep)}
                >
                  Continue Learning
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={isSaved ? <Bookmark /> : <BookmarkBorder />}
                    onClick={handleSavePlan}
                    sx={{ flex: 1 }}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<Share />}
                    sx={{ flex: 1 }}
                  >
                    Share
                  </Button>
                </Box>
                
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  fullWidth
                  onClick={handleEditPlan}
                  sx={{ mt: 2 }}
                >
                  Edit Learning Plan
                </Button>
                
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  fullWidth
                  onClick={handleDeleteDialogOpen}
                  sx={{ mt: 2 }}
                >
                  Delete Plan
                </Button>
              </CardContent>
            </Card>
            
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Related Learning Plans
                </Typography>
                <Box sx={{ opacity: 0.6, textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Related plans will be shown here based on your interests
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
        
        {/* Add Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteDialogClose}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Learning Plan
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this learning plan? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDialogClose} color="primary">
              Cancel
            </Button>
            <Button 
              onClick={handleDeletePlan} 
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
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Grid>
    </Box>
  );
};

export default LearningPlanDetailPage; 