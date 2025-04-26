import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  OutlinedInput,
  Divider,
  IconButton,
  Card,
  CardContent,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowUpward,
  ArrowDownward,
  Cancel,
  Save
} from '@mui/icons-material';
import LearningPlanService from '../services/learningPlanService';
import LearningStepService from '../services/learningStepService';
import { useAuth } from '../context/AuthContext';

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const categories = ['Regional Cuisine', 'Techniques', 'Baking', 'Specialty Diets', 'Uncategorized'];

const CreateLearningPlanPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if it exists
  const { currentUser, isAuthenticated } = useAuth(); // Get current user from AuthContext
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Main learning plan state
  const [learningPlan, setLearningPlan] = useState({
    title: '',
    description: '',
    level: 'Intermediate',
    category: 'Uncategorized',
    duration: '',
    hoursPerWeek: 3,
    requirements: [''],
    postcoverurl: ''
  });
  
  // Learning steps state
  const [steps, setSteps] = useState([
    {
      title: '',
      description: '',
      type: 'practical',
      duration: '',
      resources: [''],
      order: 0
    }
  ]);

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setError('You need to be logged in to create learning plans');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 1500);
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Fetch learning plan data if in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchLearningPlan();
    }
  }, [id]);

  const fetchLearningPlan = async () => {
    try {
      setFetching(true);
      setError(null);
      
      // Fetch learning plan
      const planData = await LearningPlanService.getLearningPlanById(id);
      
      // Check if the current user is the creator of the learning plan
      if (isAuthenticated && currentUser && planData.userId !== currentUser.id) {
        setError('You are not authorized to edit this learning plan');
        setTimeout(() => {
          navigate(`/learning-plans/${id}`);
        }, 1500);
        return;
      }
      
      // Prepare requirements array (ensure it's not empty)
      const requirements = planData.requirements && planData.requirements.length > 0 
        ? planData.requirements 
        : [''];
      
      // Update learning plan state
      setLearningPlan({
        title: planData.title || '',
        description: planData.description || '',
        level: planData.level || 'Intermediate',
        category: planData.category || 'Uncategorized',
        duration: planData.duration || '',
        hoursPerWeek: planData.hoursPerWeek || 3,
        requirements,
        postcoverurl: planData.postcoverurl || ''
      });
      
      // Fetch steps and sort by order
      const stepsData = planData.steps && planData.steps.length > 0 
        ? planData.steps.sort((a, b) => a.order - b.order).map(step => ({
            id: step.id,
            title: step.title || '',
            description: step.description || '',
            type: step.type || 'practical',
            duration: step.duration || '',
            resources: step.resources && step.resources.length > 0 ? step.resources : [''],
            order: step.order || 0
          }))
        : [{
            title: '',
            description: '',
            type: 'practical',
            duration: '',
            resources: [''],
            order: 0
          }];
      
      setSteps(stepsData);
      
    } catch (err) {
      console.error('Failed to fetch learning plan:', err);
      setError('Failed to load learning plan data. Please try again.');
    } finally {
      setFetching(false);
    }
  };
  
  const handleLearningPlanChange = (e) => {
    const { name, value } = e.target;
    setLearningPlan({
      ...learningPlan,
      [name]: value
    });
  };
  
  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...learningPlan.requirements];
    updatedRequirements[index] = value;
    setLearningPlan({
      ...learningPlan,
      requirements: updatedRequirements
    });
  };
  
  const addRequirement = () => {
    setLearningPlan({
      ...learningPlan,
      requirements: [...learningPlan.requirements, '']
    });
  };
  
  const removeRequirement = (index) => {
    const updatedRequirements = [...learningPlan.requirements];
    updatedRequirements.splice(index, 1);
    setLearningPlan({
      ...learningPlan,
      requirements: updatedRequirements
    });
  };
  
  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [field]: value
    };
    setSteps(updatedSteps);
  };
  
  const handleResourceChange = (stepIndex, resourceIndex, value) => {
    const updatedSteps = [...steps];
    const resources = [...updatedSteps[stepIndex].resources];
    resources[resourceIndex] = value;
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      resources
    };
    setSteps(updatedSteps);
  };
  
  const addResource = (stepIndex) => {
    const updatedSteps = [...steps];
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      resources: [...updatedSteps[stepIndex].resources, '']
    };
    setSteps(updatedSteps);
  };
  
  const removeResource = (stepIndex, resourceIndex) => {
    const updatedSteps = [...steps];
    const resources = [...updatedSteps[stepIndex].resources];
    resources.splice(resourceIndex, 1);
    updatedSteps[stepIndex] = {
      ...updatedSteps[stepIndex],
      resources
    };
    setSteps(updatedSteps);
  };
  
  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: '',
        description: '',
        type: 'practical',
        duration: '',
        resources: [''],
        order: steps.length
      }
    ]);
  };
  
  const removeStep = (index) => {
    if (steps.length === 1) {
      return; // Don't remove the last step
    }
    
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    
    // Update order of remaining steps
    updatedSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(updatedSteps);
  };
  
  const moveStepUp = (index) => {
    if (index === 0) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index - 1];
    updatedSteps[index - 1] = temp;
    
    // Update order values
    updatedSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(updatedSteps);
  };
  
  const moveStepDown = (index) => {
    if (index === steps.length - 1) return;
    
    const updatedSteps = [...steps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index + 1];
    updatedSteps[index + 1] = temp;
    
    // Update order values
    updatedSteps.forEach((step, i) => {
      step.order = i;
    });
    
    setSteps(updatedSteps);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      setError('You need to be logged in to create learning plans');
      setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 1500);
      return;
    }
    
    // Validation logic
    if (!learningPlan.title.trim()) {
      setError('Please provide a title for the learning plan');
      return;
    }
    
    if (!learningPlan.description.trim()) {
      setError('Please provide a description for the learning plan');
      return;
    }
    
    // Validate steps
    const invalidStepIndex = steps.findIndex(step => !step.title.trim() || !step.description.trim());
    if (invalidStepIndex !== -1) {
      setError(`Please provide a title and description for step ${invalidStepIndex + 1}`);
      return;
    }
    
    // Filter out empty requirements and resources
    const filteredRequirements = learningPlan.requirements.filter(req => req.trim());
    const filteredSteps = steps.map(step => ({
      ...step,
      resources: step.resources.filter(res => res.trim())
    }));
    
    try {
      setLoading(true);
      setError(null);
      
      // Get the current user ID from auth context
      const userId = currentUser.id;
      
      // Use a default image URL if none is provided
      if (!learningPlan.postcoverurl) {
        const randomQuery = ['cooking', 'chef', 'food', 'kitchen', 'culinary'][Math.floor(Math.random() * 5)];
        const randomNum = Math.floor(Math.random() * 30);
        learningPlan.postcoverurl = `https://source.unsplash.com/featured/1200x800/?${randomQuery}&sig=${randomNum}`;
        console.log('Using default image URL:', learningPlan.postcoverurl);
      }
      
      // Create learning plan data
      const planData = {
        ...learningPlan,
        requirements: filteredRequirements,
        userId, // Set the user ID from the authenticated user
        authorName: currentUser.name, // Include the user's name for display
        progress: isEditMode ? undefined : 0,
        completed: isEditMode ? undefined : false
      };

      console.log("Submitting learning plan with user ID:", userId);
      
      let resultPlan;
      
      if (isEditMode) {
        // Update existing plan
        resultPlan = await LearningPlanService.updateLearningPlan(id, planData);
        
        // Update steps (delete and recreate all steps)
        const stepPromises = filteredSteps.map(step => {
          // If step has an ID, it's an existing step that needs to be updated
          if (step.id) {
            return LearningStepService.updateLearningStep(step.id, {
              ...step,
              learningPlanId: id
            });
          } else {
            // Otherwise create a new step
            return LearningStepService.createLearningStep({
              ...step,
              learningPlanId: id,
              completed: false
            });
          }
        });
        
        await Promise.all(stepPromises);
        
        setSuccess(true);
        setTimeout(() => {
          navigate(`/learning-plans/${id}`);
        }, 1500);
      } else {
        // Create new learning plan
        resultPlan = await LearningPlanService.createLearningPlan(planData);
        
        // Create all steps for the new plan
        const stepPromises = filteredSteps.map(step => {
          return LearningStepService.createLearningStep({
            ...step,
            learningPlanId: resultPlan.id,
            completed: false
          });
        });
        
        await Promise.all(stepPromises);
        
        setSuccess(true);
        setTimeout(() => {
          navigate(`/learning-plans/${resultPlan.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to save learning plan:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(false);
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {isEditMode ? 'Edit Learning Plan' : 'Create New Learning Plan'}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {isEditMode 
          ? 'Update your learning plan to improve its content and structure'
          : 'Design a step-by-step learning plan to help others master cooking skills and techniques'}
      </Typography>
      
      {fetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Learning Plan Details
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  name="title"
                  value={learningPlan.title}
                  onChange={handleLearningPlanChange}
                  fullWidth
                  required
                  placeholder="e.g., Italian Cuisine Mastery"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Cover Image URL
                </Typography>
                
                <Box sx={{ 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  borderRadius: 2,
                  p: 3,
                  mb: 2,
                  bgcolor: 'background.paper'
                }}>
                  <TextField
                    fullWidth
                    label="Image URL"
                    name="postcoverurl"
                    value={learningPlan.postcoverurl}
                    onChange={handleLearningPlanChange}
                    variant="outlined"
                    placeholder="https://example.com/image.jpg"
                    sx={{ mb: 2 }}
                    helperText="Enter a URL for your learning plan cover image"
                  />
                  
                  {/* Display the image preview if URL is provided */}
                  {learningPlan.postcoverurl && (
                    <Box sx={{ 
                      width: '100%', 
                      mt: 2, 
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <img 
                        src={learningPlan.postcoverurl} 
                        alt="Learning plan cover preview" 
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '300px', 
                          borderRadius: '8px',
                          display: 'inline-block',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                        }}
                      />
                      <IconButton 
                        sx={{ 
                          position: 'absolute', 
                          top: 8, 
                          right: 8, 
                          bgcolor: 'rgba(0,0,0,0.5)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.7)',
                          }
                        }}
                        onClick={() => setLearningPlan({...learningPlan, postcoverurl: ''})}
                      >
                        <Cancel />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="caption" color="text.secondary" display="block">
                  Recommended: Use a high-quality image with dimensions of 1200 x 800 pixels for best appearance.
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={learningPlan.description}
                  onChange={handleLearningPlanChange}
                  fullWidth
                  required
                  multiline
                  rows={4}
                  placeholder="Describe what learners will achieve by following this plan"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    name="level"
                    value={learningPlan.level}
                    onChange={handleLearningPlanChange}
                    label="Level"
                  >
                    {levels.map(level => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={learningPlan.category}
                    onChange={handleLearningPlanChange}
                    label="Category"
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Duration"
                  name="duration"
                  value={learningPlan.duration}
                  onChange={handleLearningPlanChange}
                  fullWidth
                  placeholder="e.g., 4 weeks"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Hours Per Week"
                  name="hoursPerWeek"
                  type="number"
                  value={learningPlan.hoursPerWeek}
                  onChange={handleLearningPlanChange}
                  fullWidth
                  inputProps={{ min: 1, max: 40 }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Requirements
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  List any prerequisites or materials needed for this learning plan
                </Typography>
                
                {learningPlan.requirements.map((requirement, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      fullWidth
                      placeholder={`Requirement ${index + 1}`}
                      size="small"
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => removeRequirement(index)}
                      disabled={learningPlan.requirements.length === 1 && !requirement}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={addRequirement}
                  sx={{ mt: 1 }}
                >
                  Add Requirement
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              Learning Steps
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Break down your learning plan into sequential steps
            </Typography>
            
            {steps.map((step, stepIndex) => (
              <Card key={stepIndex} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">
                      Step {stepIndex + 1}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => moveStepUp(stepIndex)}
                        disabled={stepIndex === 0}
                      >
                        <ArrowUpward fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => moveStepDown(stepIndex)}
                        disabled={stepIndex === steps.length - 1}
                      >
                        <ArrowDownward fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => removeStep(stepIndex)}
                        disabled={steps.length === 1}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Step Title"
                        value={step.title}
                        onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                        fullWidth
                        required
                        placeholder="e.g., Introduction to Italian Cuisine"
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={step.type}
                          onChange={(e) => handleStepChange(stepIndex, 'type', e.target.value)}
                          label="Type"
                        >
                          <MenuItem value="video">Video</MenuItem>
                          <MenuItem value="practical">Practical</MenuItem>
                          <MenuItem value="reading">Reading</MenuItem>
                          <MenuItem value="quiz">Quiz</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Duration"
                        value={step.duration}
                        onChange={(e) => handleStepChange(stepIndex, 'duration', e.target.value)}
                        fullWidth
                        size="small"
                        placeholder="e.g., 1.5 hours"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Description"
                        value={step.description}
                        onChange={(e) => handleStepChange(stepIndex, 'description', e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={3}
                        placeholder="Describe what will be covered in this step"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Resources
                      </Typography>
                      
                      {step.resources.map((resource, resourceIndex) => (
                        <Box key={resourceIndex} sx={{ display: 'flex', mb: 1 }}>
                          <TextField
                            value={resource}
                            onChange={(e) => handleResourceChange(stepIndex, resourceIndex, e.target.value)}
                            fullWidth
                            size="small"
                            placeholder="URL or resource description"
                          />
                          <IconButton 
                            color="error" 
                            onClick={() => removeResource(stepIndex, resourceIndex)}
                            disabled={step.resources.length === 1 && !resource}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                      
                      <Button 
                        startIcon={<AddIcon />} 
                        onClick={() => addResource(stepIndex)}
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Add Resource
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />} 
              onClick={addStep}
              fullWidth
              sx={{ mb: 3 }}
            >
              Add Step
            </Button>
          </Paper>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
              disabled={loading}
            >
              {isEditMode ? 'Update Learning Plan' : 'Create Learning Plan'}
            </Button>
          </Box>
        </form>
      )}
      
      <Snackbar
        open={!!error || success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={success ? 'success' : 'error'}
          variant="filled"
        >
          {success 
            ? `Learning plan ${isEditMode ? 'updated' : 'created'} successfully!` 
            : error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateLearningPlanPage; 