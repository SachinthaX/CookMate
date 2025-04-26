import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePostPage from './pages/CreatePostPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { Box } from '@mui/material';

export default function App() {
  return (
    <Router>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflowX: 'hidden',
          backgroundColor: '#f7f9fc', // Nice subtle background
        }}
      >
        {/* Header always on top */}
        <Header />

        {/* Main content with padding top so content doesn't hide behind header */}
        <Box
          component="main"
          flex={1}
          sx={{
            pt: 10, // Padding Top to push content below Header (80px)
            px: { xs: 2, md: 6 }, // Responsive horizontal padding
            py: 4, // Padding vertical (top-bottom)
          }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
          </Routes>
        </Box>

        {/* Footer always at the bottom */}
        <Footer />
      </Box>
    </Router>
  );
}
