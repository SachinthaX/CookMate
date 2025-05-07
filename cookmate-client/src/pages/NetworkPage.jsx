import { useState } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Avatar, 
  Tabs,
  Tab,
  Paper,
  InputBase,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip
} from '@mui/material';
import { 
  Search as SearchIcon,
  PersonAdd,
  Check,
  Close,
  Restaurant,
  School
} from '@mui/icons-material';

// Mock data
const connectionsData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Professional Chef',
    location: 'New York, NY',
    connections: 253,
    avatar: 'https://source.unsplash.com/random/300x300/?woman',
    bio: 'Award-winning chef specializing in French cuisine with 10+ years of experience in Michelin-starred restaurants.',
    expertise: ['French Cuisine', 'Pastry', 'Farm-to-Table'],
    mutualConnections: 8
  },
  {
    id: 2,
    name: 'Michael Chen',
    title: 'Culinary Instructor',
    location: 'San Francisco, CA',
    connections: 412,
    avatar: 'https://source.unsplash.com/random/300x300/?man',
    bio: 'Culinary educator passionate about teaching Asian cooking techniques to home cooks of all skill levels.',
    expertise: ['Asian Fusion', 'Knife Skills', 'Cooking Education'],
    mutualConnections: 12
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    title: 'Food Photographer',
    location: 'Miami, FL',
    connections: 189,
    avatar: 'https://source.unsplash.com/random/300x300/?photographer',
    bio: 'Capturing the art of food through my lens. Specializing in cookbook photography and restaurant marketing.',
    expertise: ['Food Styling', 'Visual Storytelling', 'Marketing'],
    mutualConnections: 5
  },
  {
    id: 4,
    name: 'David Williams',
    title: 'Pastry Chef',
    location: 'Chicago, IL',
    connections: 327,
    avatar: 'https://source.unsplash.com/random/300x300/?baker',
    bio: 'Creating innovative desserts that blend classic techniques with modern flavors. Chocolate is my passion.',
    expertise: ['Chocolate Work', 'French Pastry', 'Dessert Innovation'],
    mutualConnections: 15
  },
  {
    id: 5,
    name: 'Aisha Patel',
    title: 'Nutrition Coach',
    location: 'Austin, TX',
    connections: 278,
    avatar: 'https://source.unsplash.com/random/300x300/?nutritionist',
    bio: 'Helping chefs and home cooks create dishes that are both delicious and nutritionally balanced.',
    expertise: ['Recipe Development', 'Healthy Cooking', 'Plant-Based Nutrition'],
    mutualConnections: 3
  },
  {
    id: 6,
    name: 'Robert Kim',
    title: 'Executive Chef',
    location: 'Seattle, WA',
    connections: 503,
    avatar: 'https://source.unsplash.com/random/300x300/?chef',
    bio: 'Leading innovative restaurant concepts with a focus on sustainable seafood and local ingredients.',
    expertise: ['Seafood', 'Restaurant Management', 'Sustainable Cooking'],
    mutualConnections: 7
  }
];

const pendingInvitations = [
  {
    id: 101,
    name: 'James Moore',
    title: 'Butcher & Meat Specialist',
    avatar: 'https://source.unsplash.com/random/300x300/?butcher',
    mutualConnections: 4,
    sent: false
  },
  {
    id: 102,
    name: 'Maria Gonzalez',
    title: 'Cookbook Author',
    avatar: 'https://source.unsplash.com/random/300x300/?author',
    mutualConnections: 9,
    sent: true
  },
  {
    id: 103,
    name: 'Thomas Wilson',
    title: 'Sommelier',
    avatar: 'https://source.unsplash.com/random/300x300/?wine',
    mutualConnections: 2,
    sent: false
  }
];

const peopleYouMayKnow = [
  {
    id: 201,
    name: 'Olivia Brown',
    title: 'Food Stylist',
    avatar: 'https://source.unsplash.com/random/300x300/?stylist',
    mutualConnections: 11,
    reason: 'Worked at Gourmet Magazine'
  },
  {
    id: 202,
    name: 'Liam Davis',
    title: 'Sourdough Baker',
    avatar: 'https://source.unsplash.com/random/300x300/?bread',
    mutualConnections: 6,
    reason: 'Connected with 6 people you know'
  },
  {
    id: 203,
    name: 'Sophia Lee',
    title: 'Food Scientist',
    avatar: 'https://source.unsplash.com/random/300x300/?scientist',
    mutualConnections: 8,
    reason: 'Similar background in culinary arts'
  },
  {
    id: 204,
    name: 'Ethan Martinez',
    title: 'Restaurant Consultant',
    avatar: 'https://source.unsplash.com/random/300x300/?consultant',
    mutualConnections: 15,
    reason: 'In your area'
  }
];

const NetworkPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState(connectionsData);
  const [pending, setPending] = useState(pendingInvitations);
  const [suggestions, setSuggestions] = useState(peopleYouMayKnow);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter connections based on search term
    if (e.target.value) {
      const filteredConnections = connectionsData.filter(connection => 
        connection.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        connection.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        connection.location.toLowerCase().includes(e.target.value.toLowerCase()) ||
        connection.bio.toLowerCase().includes(e.target.value.toLowerCase()) ||
        connection.expertise.some(skill => skill.toLowerCase().includes(e.target.value.toLowerCase()))
      );
      setConnections(filteredConnections);
    } else {
      setConnections(connectionsData);
    }
  };
  
  const acceptInvitation = (id) => {
    setPending(pending.filter(invite => invite.id !== id));
    // In a real app, would also add to connections
  };
  
  const rejectInvitation = (id) => {
    setPending(pending.filter(invite => invite.id !== id));
  };
  
  const connectWithSuggestion = (id) => {
    // Mark suggestion as pending (sent)
    setSuggestions(suggestions.filter(person => person.id !== id));
    // In a real app, would add to pending sent list
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        My Culinary Network
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Connect with other culinary professionals, share ideas, and grow your cooking network.
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="My Connections" />
          <Tab label={`Pending (${pending.length})`} />
          <Tab label="Suggestions" />
        </Tabs>
      </Box>
      
      {/* Search Bar */}
      <Paper sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search your network..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </Paper>
      
      {/* Connections Tab */}
      {tabValue === 0 && (
        <>
          <Grid container spacing={3}>
            {connections.length > 0 ? (
              connections.map(connection => (
                <Grid item key={connection.id} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Avatar 
                          src={connection.avatar} 
                          sx={{ width: 80, height: 80, mr: 2 }} 
                        />
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {connection.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {connection.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {connection.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {connection.connections} connections
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {connection.bio}
                      </Typography>
                      
                      <Typography variant="subtitle2" gutterBottom>
                        Expertise
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        {connection.expertise.map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {connection.mutualConnections} mutual connections
                        </Typography>
                        <Button 
                          size="small" 
                          variant="outlined"
                          component="a"
                          href={`/profile/${connection.id}`}
                        >
                          View Profile
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom>
                    No connections found matching "{searchTerm}"
                  </Typography>
                  <Button 
                    variant="outlined"
                    onClick={() => {
                      setSearchTerm('');
                      setConnections(connectionsData);
                    }}
                  >
                    Clear Search
                  </Button>
                </Paper>
              </Grid>
            )}
          </Grid>
        </>
      )}
      
      {/* Pending Invitations Tab */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Invitations
          </Typography>
          <List>
            {pending.filter(invitation => !invitation.sent).map(invitation => (
              <ListItem 
                key={invitation.id}
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  py: 2
                }}
              >
                <ListItemAvatar>
                  <Avatar src={invitation.avatar} sx={{ width: 56, height: 56 }} />
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1">
                      {invitation.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {invitation.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {invitation.mutualConnections} mutual connections
                      </Typography>
                    </>
                  }
                  sx={{ ml: 1 }}
                />
                <Box>
                  <Button 
                    variant="contained" 
                    size="small"
                    onClick={() => acceptInvitation(invitation.id)}
                    startIcon={<Check />}
                    sx={{ mr: 1 }}
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => rejectInvitation(invitation.id)}
                    startIcon={<Close />}
                  >
                    Ignore
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Sent Invitations
          </Typography>
          <List>
            {pending.filter(invitation => invitation.sent).map(invitation => (
              <ListItem 
                key={invitation.id}
                sx={{ 
                  borderBottom: '1px solid #f0f0f0',
                  py: 2
                }}
              >
                <ListItemAvatar>
                  <Avatar src={invitation.avatar} sx={{ width: 56, height: 56 }} />
                </ListItemAvatar>
                <ListItemText 
                  primary={
                    <Typography variant="subtitle1">
                      {invitation.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {invitation.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {invitation.mutualConnections} mutual connections
                      </Typography>
                    </>
                  }
                  sx={{ ml: 1 }}
                />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Button 
                    variant="text" 
                    size="small" 
                    color="error"
                    onClick={() => rejectInvitation(invitation.id)}
                  >
                    Withdraw
                  </Button>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      
      {/* Suggestions Tab */}
      {tabValue === 2 && (
        <>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              People You May Know
            </Typography>
            <List>
              {suggestions.map(person => (
                <ListItem 
                  key={person.id}
                  sx={{ 
                    borderBottom: '1px solid #f0f0f0',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={person.avatar} sx={{ width: 56, height: 56 }} />
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Typography variant="subtitle1">
                        {person.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {person.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {person.mutualConnections} mutual connections
                        </Typography>
                        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                          {person.reason}
                        </Typography>
                      </>
                    }
                    sx={{ ml: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    size="small"
                    onClick={() => connectWithSuggestion(person.id)}
                    startIcon={<PersonAdd />}
                  >
                    Connect
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Chefs to Follow
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem 
                      key={item}
                      sx={{ 
                        borderBottom: '1px solid #f0f0f0',
                        py: 1.5
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={`https://source.unsplash.com/random/300x300/?chef${item}`} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`Top Chef ${item}`}
                        secondary="Award-winning recipes"
                      />
                      <Button 
                        size="small" 
                        startIcon={<Restaurant />}
                      >
                        Follow
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Popular Instructors
                </Typography>
                <List>
                  {[1, 2, 3].map((item) => (
                    <ListItem 
                      key={item}
                      sx={{ 
                        borderBottom: '1px solid #f0f0f0',
                        py: 1.5
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={`https://source.unsplash.com/random/300x300/?instructor${item}`} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`Master Instructor ${item}`}
                        secondary="5-star learning plans"
                      />
                      <Button 
                        size="small" 
                        startIcon={<School />}
                      >
                        Follow
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default NetworkPage; 