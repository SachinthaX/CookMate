import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <Navbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          width: '100%',
          py: 3,
          px: 0,
          overflowX: 'hidden',
          backgroundColor: '#f9f9f9'
        }}
      >
        <Container 
          sx={{ 
            width: '100%',
            maxWidth: '100% !important',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          {children || <Outlet />}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout; 