import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="sticky"  elevation={4}  sx={{
      backgroundColor: '#e65100', // <-- custom color
    }}
>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo / Brand */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'white',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: 1,
            }}
          >
            🍳 CookMate
          </Typography>

          {/* Navigation Buttons */}
          <Box display="flex" alignItems="center" gap={2}>
            

            <Button
              component={Link}
              to="/create-post"
              variant="contained"
              color="secondary"
              sx={{
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              + Create Post
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
