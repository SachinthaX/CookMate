import { Container, Grid, Typography, Stack, Box, Avatar } from '@mui/material';
import PostList from '../components/PostList'; // your post listing component

// Dummy data (later you can fetch dynamically)
const dummyStories = ['Anura', 'Nuwan', 'Naveen', 'Nadun69'];
const dummySuggestions = ['Sachini', 'Naveen', 'Samadhi', 'Niran'];

export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        
        {/* Left Side - Stories */}
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6" gutterBottom>
            Stories
          </Typography>
          <Stack spacing={2}>
            {dummyStories.map((name, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {name.charAt(0)}
                </Avatar>
                <Typography>{name}</Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

        {/* Center - All Posts */}
        <Grid item xs={12} md={7}>
          <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
            All Posts
          </Typography>
          <PostList />
        </Grid>

        {/* Right Side - Suggestions For You */}
        <Grid item xs={12} md={2.5}>
          <Typography variant="h6" gutterBottom>
            Suggestions For You
          </Typography>
          <Stack spacing={2}>
            {dummySuggestions.map((name, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {name.charAt(0)}
                </Avatar>
                <Typography>{name}</Typography>
              </Box>
            ))}
          </Stack>
        </Grid>

      </Grid>
    </Container>
  );
}
