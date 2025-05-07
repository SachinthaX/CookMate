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
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  TextField,
  IconButton,
  Badge
} from '@mui/material';
import { 
  Edit as EditIcon,
  LocationOn,
  Email,
  Language,
  Restaurant,
  School,
  People,
  Star,
  Photo,
  Upload,
  Article
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock user data
const userProfile = {
  id: 1,
  name: 'Alex Morgan',
  title: 'Culinary Arts Student | Food Enthusiast',
  location: 'New York, NY',
  email: 'alex.morgan@example.com',
  website: 'alexcooks.example.com',
  bio: 'Passionate about exploring global cuisines and learning new cooking techniques. Currently specializing in French and Mediterranean cooking methods with a focus on sustainable ingredients.',
  cover: 'https://source.unsplash.com/random/1200x300/?food',
  avatar: 'https://source.unsplash.com/random/200x200/?portrait',
  connections: 324,
  skills: [
    'French Cuisine', 
    'Mediterranean Cooking', 
    'Knife Skills', 
    'Sauce Making', 
    'Bread Baking',
    'Food Photography'
  ],
  certifications: [
    { name: 'Culinary Arts Foundation', issuer: 'Culinary Institute', date: 'April 2022' },
    { name: 'Food Safety and Hygiene', issuer: 'ServSafe', date: 'January 2023' }
  ],
  education: [
    { 
      institution: 'Culinary Institute of America', 
      degree: 'Bachelor of Culinary Arts', 
      field: 'Culinary Science', 
      start: '2020', 
      end: 'Present' 
    }
  ]
};

// Mock stats
const userStats = {
  profileViews: 324,
  recipeViews: 1289,
  learningPlans: 7,
  followers: 256,
  following: 142,
  completedPlans: 5
};

// Mock activity data
const userActivity = [
  {
    id: 1,
    type: 'recipe',
    title: 'Shared a new recipe: "Lemon Garlic Butter Salmon"',
    date: '2 days ago',
    image: 'https://source.unsplash.com/random/100x100/?salmon',
    engagement: { likes: 48, comments: 12 }
  },
  {
    id: 2,
    type: 'learning',
    title: 'Completed a learning plan: "Italian Pasta Masterclass"',
    date: '1 week ago',
    image: 'https://source.unsplash.com/random/100x100/?pasta',
    engagement: { likes: 36, comments: 8 }
  },
  {
    id: 3,
    type: 'achievement',
    title: 'Earned the "Sauce Expert" badge',
    date: '2 weeks ago',
    image: 'https://source.unsplash.com/random/100x100/?sauce',
    engagement: { likes: 52, comments: 15 }
  },
  {
    id: 4,
    type: 'learning',
    title: 'Started a new learning plan: "Advanced Bread Baking"',
    date: '1 month ago',
    image: 'https://source.unsplash.com/random/100x100/?bread',
    engagement: { likes: 27, comments: 6 }
  },
  {
    id: 5,
    type: 'recipe',
    title: 'Shared a new recipe: "Mediterranean Chickpea Salad"',
    date: '1 month ago',
    image: 'https://source.unsplash.com/random/100x100/?salad',
    engagement: { likes: 64, comments: 18 }
  }
];

// Mock recipes data
const userRecipes = [
  {
    id: 1,
    title: 'Lemon Garlic Butter Salmon',
    image: 'https://source.unsplash.com/random/300x200/?salmon',
    rating: 4.8,
    reviewCount: 36,
    date: '2 days ago'
  },
  {
    id: 2,
    title: 'Mediterranean Chickpea Salad',
    image: 'https://source.unsplash.com/random/300x200/?salad',
    rating: 4.6,
    reviewCount: 24,
    date: '1 month ago'
  },
  {
    id: 3,
    title: 'Homemade Sourdough Bread',
    image: 'https://source.unsplash.com/random/300x200/?bread',
    rating: 4.9,
    reviewCount: 42,
    date: '2 months ago'
  },
  {
    id: 4,
    title: 'Classic French Onion Soup',
    image: 'https://source.unsplash.com/random/300x200/?soup',
    rating: 4.7,
    reviewCount: 31,
    date: '3 months ago'
  }
];

// Mock learning plans data
const userLearningPlans = [
  {
    id: 1,
    title: 'French Sauce Fundamentals',
    progress: 85,
    enrolled: 246,
    steps: 12,
    image: 'https://source.unsplash.com/random/300x200/?sauce'
  },
  {
    id: 2,
    title: 'Knife Skills Masterclass',
    progress: 100,
    enrolled: 389,
    steps: 8,
    image: 'https://source.unsplash.com/random/300x200/?knife'
  },
  {
    id: 3,
    title: 'Artisan Bread Baking',
    progress: 60,
    enrolled: 174,
    steps: 15,
    image: 'https://source.unsplash.com/random/300x200/?breadbaking'
  }
];

const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleEditProfile = () => {
    setEditMode(true);
  };
  
  const handleSaveProfile = () => {
    setEditMode(false);
    // In a real app, would save profile data to backend
  };

  return (
    <Grid container spacing={4}>
      {/* Cover Photo and Profile Header */}
      <Grid item xs={12}>
        <Box sx={{ position: 'relative', mb: 6 }}>
          <Box 
            sx={{ 
              height: { xs: 150, md: 200 }, 
              backgroundImage: `url(${profile.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 2
            }} 
          />
          
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: -50, 
              left: { xs: 'calc(50% - 50px)', md: 32 },
              transform: { xs: 'translateX(-50%)', md: 'none' }
            }}
          >
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                editMode && (
                  <IconButton 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' }
                    }}
                    size="small"
                  >
                    <Upload fontSize="small" />
                  </IconButton>
                )
              }
            >
              <Avatar 
                src={profile.avatar} 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  border: '4px solid white',
                  boxShadow: 2
                }} 
              />
            </Badge>
          </Box>
          
          {editMode && (
            <IconButton 
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                bgcolor: 'primary.main', 
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
              size="small"
            >
              <Photo />
            </IconButton>
          )}
          
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              pl: { xs: 2, md: 20 },
              pr: 2,
              mt: { xs: 6, md: 1 }
            }}
          >
            <Box>
              {editMode ? (
                <TextField 
                  label="Name"
                  variant="outlined"
                  size="small"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  sx={{ mb: 1, display: 'block' }}
                />
              ) : (
                <Typography variant="h4" component="h1" gutterBottom>
                  {profile.name}
                </Typography>
              )}
              
              {editMode ? (
                <TextField 
                  label="Title/Headline"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={profile.title}
                  onChange={(e) => setProfile({...profile, title: e.target.value})}
                  sx={{ mb: 1, display: 'block' }}
                />
              ) : (
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {profile.title}
                </Typography>
              )}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  {editMode ? (
                    <TextField 
                      size="small"
                      value={profile.location}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      sx={{ width: 150 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {profile.location}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Email fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  {editMode ? (
                    <TextField 
                      size="small"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      sx={{ width: 200 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {profile.email}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Language fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  {editMode ? (
                    <TextField 
                      size="small"
                      value={profile.website}
                      onChange={(e) => setProfile({...profile, website: e.target.value})}
                      sx={{ width: 200 }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {profile.website}
                    </Typography>
                  )}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <People fontSize="small" color="action" sx={{ mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {profile.connections} connections
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            <Box>
              {editMode ? (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleSaveProfile}
                >
                  Save Profile
                </Button>
              ) : (
                <Button 
                  variant="outlined" 
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Grid>
      
      <Grid item xs={12} md={8}>
        {/* Bio Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          {editMode ? (
            <TextField 
              multiline
              rows={4}
              fullWidth
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
            />
          ) : (
            <Typography variant="body1">
              {profile.bio}
            </Typography>
          )}
        </Paper>
        
        {/* Tabs for Activity, Recipes, Learning Plans */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Activity" />
              <Tab label="Recipes" />
              <Tab label="Learning Plans" />
            </Tabs>
          </Box>
          
          {/* Activity Feed */}
          {tabValue === 0 && (
            <Box sx={{ p: 3 }}>
              {userActivity.map((activity) => (
                <Box 
                  key={activity.id}
                  sx={{ 
                    mb: 3, 
                    pb: 3,
                    borderBottom: activity.id !== userActivity.length ? '1px solid #e0e0e0' : 'none'
                  }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Avatar 
                      src={profile.avatar} 
                      sx={{ mr: 2, width: 48, height: 48 }} 
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">
                          {profile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.date}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {activity.title}
                      </Typography>
                      
                      {activity.image && (
                        <Box 
                          component="img"
                          src={activity.image}
                          alt={activity.title}
                          sx={{ 
                            width: '100%',
                            height: 200,
                            objectFit: 'cover',
                            borderRadius: 1,
                            mb: 1
                          }}
                        />
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                          {activity.engagement.likes} likes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.engagement.comments} comments
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          
          {/* Recipes */}
          {tabValue === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  My Recipes
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link}
                  to="/my-recipes/new"
                  size="small"
                >
                  Add Recipe
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {userRecipes.map(recipe => (
                  <Grid item key={recipe.id} xs={12} sm={6}>
                    <Paper sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          width: 120,
                          backgroundImage: `url(${recipe.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <Box sx={{ p: 2, flex: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          component={Link}
                          to={`/recipes/${recipe.id}`}
                          sx={{ 
                            color: 'text.primary',
                            textDecoration: 'none',
                            '&:hover': { color: 'primary.main' },
                            display: 'block'
                          }}
                        >
                          {recipe.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: 'gold', fontSize: 18, mr: 0.5 }} />
                            <Typography variant="body2">
                              {recipe.rating}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({recipe.reviewCount} reviews)
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          Added {recipe.date}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  component={Link}
                  to="/my-recipes"
                >
                  View All Recipes
                </Button>
              </Box>
            </Box>
          )}
          
          {/* Learning Plans */}
          {tabValue === 2 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  My Learning Plans
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link}
                  to="/my-learning-plans/new"
                  size="small"
                >
                  Create Learning Plan
                </Button>
              </Box>
              
              <Grid container spacing={2}>
                {userLearningPlans.map(plan => (
                  <Grid item key={plan.id} xs={12}>
                    <Paper sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                      <Box 
                        sx={{ 
                          width: 120,
                          backgroundImage: `url(${plan.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <Box sx={{ p: 2, flex: 1 }}>
                        <Typography 
                          variant="subtitle1" 
                          component={Link}
                          to={`/learning-plans/${plan.id}`}
                          sx={{ 
                            color: 'text.primary',
                            textDecoration: 'none',
                            '&:hover': { color: 'primary.main' },
                            display: 'block'
                          }}
                        >
                          {plan.title}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                          <School fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {plan.steps} steps
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            {plan.enrolled} enrolled
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flex: 1, mr: 2 }}>
                            <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 8, borderRadius: 5 }}>
                              <Box 
                                sx={{ 
                                  width: `${plan.progress}%`, 
                                  bgcolor: plan.progress === 100 ? 'success.main' : 'primary.main', 
                                  height: 8, 
                                  borderRadius: 5 
                                }} 
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color={plan.progress === 100 ? 'success.main' : 'text.secondary'}>
                            {plan.progress}% Complete
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button 
                  component={Link}
                  to="/my-learning-plans"
                >
                  View All Learning Plans
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        {/* Stats */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Profile Stats
          </Typography>
          <List disablePadding>
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Profile views" 
                secondary={`${userStats.profileViews} in the last 30 days`}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Recipe views" 
                secondary={userStats.recipeViews}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Learning plans created" 
                secondary={userStats.learningPlans}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Learning plans completed" 
                secondary={userStats.completedPlans}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Followers" 
                secondary={userStats.followers}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem sx={{ px: 0, py: 1 }}>
              <ListItemText 
                primary="Following" 
                secondary={userStats.following}
              />
            </ListItem>
          </List>
        </Paper>
        
        {/* Skills */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Skills & Expertise
            </Typography>
            {!editMode && (
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          {editMode ? (
            <TextField 
              label="Skills (comma separated)"
              multiline
              rows={3}
              fullWidth
              value={profile.skills.join(', ')}
              onChange={(e) => setProfile({
                ...profile, 
                skills: e.target.value.split(',').map(skill => skill.trim())
              })}
              helperText="Enter skills separated by commas"
            />
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  color="primary" 
                  variant="outlined"
                />
              ))}
            </Box>
          )}
        </Paper>
        
        {/* Certifications */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Certifications
            </Typography>
            {!editMode && (
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          <List disablePadding>
            {profile.certifications.map((cert, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Article />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={cert.name} 
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {cert.issuer}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          Issued {cert.date}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < profile.certifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          
          {editMode && (
            <Button 
              variant="outlined" 
              size="small" 
              fullWidth 
              sx={{ mt: 2 }}
            >
              Add Certification
            </Button>
          )}
        </Paper>
        
        {/* Education */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Education
            </Typography>
            {!editMode && (
              <IconButton size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
          
          <List disablePadding>
            {profile.education.map((edu, index) => (
              <React.Fragment key={index}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <School />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={edu.institution} 
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {edu.degree}, {edu.field}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                          {edu.start} - {edu.end}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < profile.education.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
          
          {editMode && (
            <Button 
              variant="outlined" 
              size="small" 
              fullWidth 
              sx={{ mt: 2 }}
            >
              Add Education
            </Button>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ProfilePage; 