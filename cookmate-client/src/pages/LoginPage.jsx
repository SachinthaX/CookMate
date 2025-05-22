import React, { useState, useEffect, useRef } from 'react';
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
  Stack
} from '@mui/material';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, loading: authLoading, authInitialized } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const redirectPerformed = useRef(false);

  useEffect(() => {
    if (authInitialized && !redirectPerformed.current && isAuthenticated) {
      redirectPerformed.current = true;
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, authInitialized]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
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
    if (!validate()) return;

    setLoading(true);
    setServerError('');

    try {
      const response = await login(formData);
      if (response && (response.id || response.success)) {
        redirectPerformed.current = true;
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setServerError(response?.message || 'Login failed');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !authInitialized) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>Checking authentication...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <CssBaseline />
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

      <Container maxWidth="sm" sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        mx: 10
      }}>
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
            Log In to CookMate
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>
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
              sx={{ mt: 3, mb: 1.5, py: 1.2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>

            {/* Social Login Buttons */}
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
                Log In with Google
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                    alt="Facebook"
                    style={{ width: 20, height: 20 }}
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
                Log In with Facebook
              </Button>
            </Stack>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register">
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
