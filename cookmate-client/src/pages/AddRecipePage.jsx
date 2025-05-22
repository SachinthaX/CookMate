import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Snackbar,
  Alert,
  Container,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Cancel
} from '@mui/icons-material';
import RecipeService from '../services/recipeService';
import { useAuth } from '../context/AuthContext';

const difficultyLevels = ['Easy', 'Intermediate', 'Hard'];

const AddRecipePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if it exists
  const { currentUser, isAuthenticated } = useAuth(); // Get current user from AuthContext
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    preparationTimeMinutes: 0,
    cookingTimeMinutes: 0,
    servings: 1,
    difficulty: 'Easy',
    imageUrl: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  
  // State for managing image upload
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated) {
      setAlertMessage('You need to be logged in to create or edit recipes');
      setAlertSeverity('error');
      setAlertOpen(true);
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 1500);
    }
  }, [isAuthenticated, navigate]);

  // Fetch recipe data when in edit mode
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setFetching(true);
      const recipeData = await RecipeService.getRecipeById(id);
      
      // Check if the current user is the creator of the recipe
      if (isAuthenticated && currentUser && recipeData.createdBy !== currentUser.id) {
        setAlertMessage('You are not authorized to edit this recipe');
        setAlertSeverity('error');
        setAlertOpen(true);
        setTimeout(() => {
          navigate(`/recipes/${id}`);
        }, 1500);
        return;
      }
      
      // Ensure ingredients and instructions arrays are not empty
      const ingredients = recipeData.ingredients && recipeData.ingredients.length > 0 
        ? recipeData.ingredients 
        : [''];
        
      const instructions = recipeData.instructions && recipeData.instructions.length > 0 
        ? recipeData.instructions 
        : [''];
      
      // Update form data with fetched recipe
      setFormData({
        title: recipeData.title || '',
        description: recipeData.description || '',
        ingredients,
        instructions,
        preparationTimeMinutes: recipeData.preparationTimeMinutes || 0,
        cookingTimeMinutes: recipeData.cookingTimeMinutes || 0,
        servings: recipeData.servings || 1,
        difficulty: recipeData.difficulty || 'Easy',
        imageUrl: recipeData.imageUrl || '',
        tags: recipeData.tags || []
      });
      
    } catch (err) {
      console.error('Failed to fetch recipe:', err);
      setAlertMessage('Failed to load recipe data. Please try again.');
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, '']
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);
    setFormData({
      ...formData,
      ingredients: newIngredients
    });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData({
      ...formData,
      instructions: newInstructions
    });
  };

  const handleAddInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const handleRemoveInstruction = (index) => {
    const newInstructions = [...formData.instructions];
    newInstructions.splice(index, 1);
    setFormData({
      ...formData,
      instructions: newInstructions
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() === '') return;
    
    if (!formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
    }
    
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image URL input
  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({
      ...formData,
      imageUrl: url
    });
    
    // Clear file upload if URL is entered
    if (url) {
      setImageFile(null);
    }
  };
  
  // Remove the selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData({
      ...formData,
      imageUrl: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated || !currentUser) {
      setAlertMessage('You need to be logged in to create recipes');
      setAlertSeverity('error');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/login', { state: { from: location.pathname } });
      }, 1500);
      return;
    }
    
    // Basic validation
    if (formData.title.trim() === '') {
      setAlertMessage('Please provide a recipe title');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    if (formData.ingredients.some(ingredient => ingredient.trim() === '')) {
      setAlertMessage('Please fill in all ingredient fields or remove empty ones');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    if (formData.instructions.some(instruction => instruction.trim() === '')) {
      setAlertMessage('Please fill in all instruction steps or remove empty ones');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    try {
      setLoading(true);
      
      // Process image (URL or file upload)
      let imageUrl = formData.imageUrl;
      
      // If there's an image URL already entered, use that
      if (!imageFile && formData.imageUrl) {
        imageUrl = formData.imageUrl;
      } 
      // If there's a file selected, use a placeholder URL since we don't have a real file upload
      // In a real implementation, you would upload the file to a server and get a URL back
      else if (imageFile) {
        imageUrl = `https://source.unsplash.com/random/600x400/?food${Math.floor(Math.random() * 10)}`;
        // The real implementation would upload the file and get a URL back like this:
        /*
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        imageUrl = data.url;
        */
      }
      
      // Add current user ID from auth context
      const recipeData = {
        ...formData,
        imageUrl,
        createdBy: currentUser.id, // Use the authenticated user's ID
        createdByName: currentUser.name, // Include the user's name for display
        ingredients: formData.ingredients.filter(i => i.trim() !== ''),
        instructions: formData.instructions.filter(i => i.trim() !== '')
      };
      
      console.log("Submitting recipe with user ID:", currentUser.id);
      
      let response;
      
      if (isEditMode) {
        // Update existing recipe
        response = await RecipeService.updateRecipe(id, recipeData);
        setAlertMessage('Recipe updated successfully!');
      } else {
        // Create new recipe
        response = await RecipeService.createRecipe(recipeData);
        setAlertMessage('Recipe created successfully!');
      }
      
      setAlertSeverity('success');
      setAlertOpen(true);
      
      // Navigate to the recipe detail page after a short delay
      setTimeout(() => {
        navigate(`/recipes/${isEditMode ? id : response.id}`);
      }, 1500);
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} recipe:`, error);
      setAlertMessage(`Failed to ${isEditMode ? 'update' : 'create'} recipe. Please try again.`);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {fetching ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 4, my: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Recipe Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recipe Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  required
                />
              </Grid>
              
              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              
              {/* Recipe Image */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Recipe Image
                </Typography>
                
                {/* Option 1: Direct URL input */}
                <TextField
                  fullWidth
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  variant="outlined"
                  placeholder="https://example.com/image.jpg"
                  sx={{ mb: 2 }}
                />
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  OR
                </Typography>
                
                {/* Option 2: File upload with preview */}
                {imagePreview ? (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mb: 2 }}>
                    <img 
                      src={imagePreview} 
                      alt="Recipe preview" 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px',
                        display: 'block'
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
                      onClick={handleRemoveImage}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ mb: 2 }}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>
                )}
                
                {/* Display the current image if URL is provided but no file is selected */}
                {!imagePreview && formData.imageUrl && (
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: 400, mb: 2 }}>
                    <img 
                      src={formData.imageUrl} 
                      alt="Recipe preview from URL" 
                      style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px',
                        display: 'block'
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
                      onClick={handleRemoveImage}
                    >
                      <Cancel />
                    </IconButton>
                  </Box>
                )}
                
                <Typography variant="caption" color="text.secondary" display="block">
                  Recommended size: 1200 x 800 pixels. Max file size: 5MB.
                </Typography>
              </Grid>
              
              {/* Preparation Details */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Prep Time (minutes)"
                  name="preparationTimeMinutes"
                  type="number"
                  value={formData.preparationTimeMinutes}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cooking Time (minutes)"
                  name="cookingTimeMinutes"
                  type="number"
                  value={formData.cookingTimeMinutes}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Servings"
                  name="servings"
                  type="number"
                  value={formData.servings}
                  onChange={handleChange}
                  variant="outlined"
                  inputProps={{ min: 1 }}
                  required
                />
              </Grid>
              
              {/* Difficulty */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    label="Difficulty"
                    required
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Ingredients */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                
                {formData.ingredients.map((ingredient, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      variant="outlined"
                      sx={{ mr: 1 }}
                      required
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveIngredient(index)}
                      disabled={formData.ingredients.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Button 
                  startIcon={<AddIcon />}
                  onClick={handleAddIngredient}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Ingredient
                </Button>
              </Grid>
              
              {/* Instructions */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                
                {formData.instructions.map((instruction, index) => (
                  <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`Step ${index + 1}`}
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      variant="outlined"
                      multiline
                      rows={2}
                      sx={{ mr: 1 }}
                      required
                    />
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveInstruction(index)}
                      disabled={formData.instructions.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                
                <Button 
                  startIcon={<AddIcon />}
                  onClick={handleAddInstruction}
                  variant="outlined"
                  sx={{ mt: 1 }}
                >
                  Add Step
                </Button>
              </Grid>
              
              {/* Tags */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Tags
                </Typography>
                
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Add Tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    variant="outlined"
                    sx={{ mr: 1 }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    variant="contained"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleRemoveTag(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
            
            {/* Submit Button */}
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
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
              >
                {loading ? 
                  (isEditMode ? 'Updating...' : 'Creating...') : 
                  (isEditMode ? 'Update Recipe' : 'Create Recipe')}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
      
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setAlertOpen(false)} 
          severity={alertSeverity}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddRecipePage; 