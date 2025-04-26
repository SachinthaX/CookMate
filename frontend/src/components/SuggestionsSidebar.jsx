import { Avatar, Box, Typography, Stack } from '@mui/material';

export default function SuggestionsSidebar() {
  const suggestions = ['Sachini', 'Naveen', 'Samadhi', 'Niran'];

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Suggestions For You
      </Typography>
      <Stack spacing={2}>
        {suggestions.map((name, index) => (
          <Box key={index} display="flex" alignItems="center" gap={2}>
            <Avatar>{name.charAt(0)}</Avatar>
            <Typography>{name}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
