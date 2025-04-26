import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Link,
  Alert,
  CircularProgress
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, currentUser, isAuthenticated, loading: authLoading, authInitialized } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Use a ref to track if we've already performed a redirect
  const redirectPerformed = useRef(false);
  
  // Redirect if the user is already logged in
  useEffect(() => {
    // Only check once AND only after auth is initialized
    if (authInitialized && !redirectPerformed.current) {
      console.log("Login page - Auth redirect check:", { 
        isAuthenticated, 
        currentUser: currentUser?.id ? { id: currentUser.id } : null,
        location: location.pathname,
        from: location.state?.from?.pathname
      });
      
      if (isAuthenticated) {
        // Mark that we've performed a redirect to prevent loops
        redirectPerformed.current = true;
        
        console.log("Already logged in, redirecting from login page");
        // Get the intended destination or default to home
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    }
  }, [isAuthenticated, navigate, location, authInitialized, currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear server error when user starts typing again
    if (serverError) {
      setServerError('');
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    try {
      const response = await login(formData);
      console.log("Login response in component:", response);
      
      // Consider the login successful if we have an ID or success flag
      if (response && (response.id || response.success)) {
        // Mark that we're about to redirect to prevent loops
        redirectPerformed.current = true;
        
        // Navigate to the page the user was trying to access, or home
        const from = location.state?.from?.pathname || '/';
        console.log("Login successful, redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        setServerError(response?.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setServerError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };
  
  // If still checking authentication or loading auth state, show loading
  if (authLoading || !authInitialized) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Checking authentication...
          </Typography>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Log In to Cookmate
          </Typography>
          
          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {serverError}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" variant="body2">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage; 