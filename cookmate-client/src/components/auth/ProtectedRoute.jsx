import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState, useRef } from 'react';

/**
 * A wrapper component that redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, isAuthenticated, loading, authInitialized } = useAuth();
  const location = useLocation();
  const authCheckPerformed = useRef(false);
  const [redirecting, setRedirecting] = useState(false);
  
  useEffect(() => {
    if (authInitialized && !authCheckPerformed.current) {
      authCheckPerformed.current = true;
      
      console.log("Protected route - Auth check:", { 
        path: location.pathname,
        isAuthenticated,
        userId: currentUser?.id,
        initialized: authInitialized
      });
      
      if (!isAuthenticated) {
        setRedirecting(true);
      }
    }
  }, [isAuthenticated, currentUser, authInitialized, location.pathname]);
  
  // If we're still loading auth state or haven't initialized, show loading
  if (loading || !authInitialized) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Checking authentication...
        </Typography>
      </Box>
    );
  }
  
  // If not authenticated and we've performed the check, redirect to login
  if (!isAuthenticated && authCheckPerformed.current) {
    console.log("Not authenticated, redirecting to login from", location.pathname);
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected content
  return children;
};

export default ProtectedRoute; 