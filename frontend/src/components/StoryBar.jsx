import { Avatar, Box, Typography, Stack } from '@mui/material';

export default function StoryBar() {
  const users = ['Anura', 'Nuwan', 'Naveen', 'Nadun69'];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Stories
      </Typography>
      <Stack direction="row" spacing={2} sx={{ overflowX: 'auto' }}>
        {users.map((name, index) => (
          <Box key={index} textAlign="center">
            <Avatar sx={{ width: 56, height: 56, mx: 'auto', border: '2px solid #1976d2' }}>
              {name.charAt(0)}
            </Avatar>
            <Typography variant="caption">{name}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
