import React, { useState } from 'react';
import {
  CssBaseline,
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Link,
  Alert,
  CircularProgress,
  Grid,
  Stack
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const response = await register(formData);
      if (response.success) {
        navigate('/');
      } else {
        setServerError(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CssBaseline />

      {/* Full-screen background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/images/register-bg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />

      {/* Centered form */}
      <Container
        maxWidth="sm"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          mx: 10      // <-- remove auto‐margins so Container is at left
        }}
      >
        <Paper
          elevation={4}
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            p: 4,
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(255,255,255,0.85)'
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Create Your Account
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
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                name="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
              />
              <TextField
                required
                fullWidth
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Box>

   
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1.5, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>

            {/* Social Sign-Up Buttons */}
            <Stack spacing={2} sx={{ mt: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#4285f4',
                  '&:hover': { backgroundColor: '#3367D6' },
                  color: '#fff'
                }}
                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
              >
                Sign Up with Google
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    style={{ width: 20, height: 20,}}
                  />
                }
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#3b5998',
                  '&:hover': { backgroundColor: '#145DBF' },
                  color: '#fff'
                }}
                onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/facebook"}
              >
                Sign Up with Facebook
              </Button>
            </Stack>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login">
                  Log In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
