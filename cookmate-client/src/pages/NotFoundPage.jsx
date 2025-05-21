import { Box, Typography, Button, Paper } from '@mui/material';
import { Home as HomeIcon, RestaurantMenu } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        py: 8
      }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          bgcolor: 'background.default', 
          p: 5, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <RestaurantMenu sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
        
        <Typography variant="h2" gutterBottom fontWeight="bold">
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Oops! It looks like the recipe you're looking for has been moved or doesn't exist.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
          >
            Go to Home
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/recipes"
          >
            Browse Recipes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundPage; 