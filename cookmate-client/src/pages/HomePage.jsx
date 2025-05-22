import { useState, useEffect } from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Divider, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText,
  ListItemButton,
  Chip,
  TextField,
  IconButton,
  useTheme,
  Container,
  alpha,
  Tab,
  Tabs,
  AvatarGroup,
  Link as MuiLink,
  LinearProgress
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder,
  Comment, 
  Share, 
  BookmarkBorder, 
  Bookmark,
  Add,
  RestaurantMenu,
  School,
  TrendingUp,
  Whatshot,
  LocalFireDepartment,
  Explore,
  Image as ImageIcon,
  EmojiEmotions,
  AddCircle,
  ArrowForward,
  ChatBubbleOutline,
  MoreVert,
  InsertPhoto,
  HomeRounded,
  SearchRounded,
  AddCircleOutline,
  NotificationsRounded,
  PersonRounded,
  Restaurant as RestaurantIcon,
  School as SchoolIcon,
  Whatshot as WhatshotIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Mock data for demonstration
const featuredRecipes = [
  { id: 1, title: 'Homemade Pasta Carbonara', author: 'Jamie Oliver', image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', likes: 327 },
  { id: 2, title: 'Perfect Steak with Red Wine Sauce', author: 'Gordon Ramsay', image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', likes: 245 },
  { id: 3, title: 'Vegan Buddha Bowl', author: 'Ella Mills', image: 'https://images.unsplash.com/photo-1540914124281-342587941389?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80', likes: 189 }
];

const learningPlans = [
  { id: 1, title: 'Italian Cuisine Mastery', steps: 12, enrolled: 450, image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
  { id: 2, title: 'Knife Skills Advanced', steps: 8, enrolled: 322, image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80' },
  { id: 3, title: 'Baking Fundamentals', steps: 15, enrolled: 678, image: 'https://images.unsplash.com/photo-1554824546-dc31274f8a0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }
];

const feedPosts = [
  {
    id: 1,
    author: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    role: 'Professional Chef',
    time: '2 hours ago',
    content: 'Just finished creating a new recipe for honey-glazed salmon with asparagus. The key is to use high-quality honey and fresh herbs!',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    likes: 76,
    comments: 23,
    shares: 12
  },
  {
    id: 2,
    author: 'Mark Williams',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
    role: 'Home Cook Enthusiast',
    time: '5 hours ago',
    content: 'Attended my first sourdough workshop today. Learning to make your own starter is a game-changer! Anyone else into bread making?',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    likes: 154,
    comments: 42,
    shares: 18
  },
  {
    id: 3,
    author: 'Chen Liu',
    avatar: 'https://images.unsplash.com/photo-1560787313-5dff3307e257?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    role: 'Culinary Instructor',
    time: '1 day ago',
    content: 'Just published my new learning plan "Asian Fusion Techniques" on CookMate! Check it out if you want to expand your culinary horizons.',
    likes: 203,
    comments: 56,
    shares: 41
  }
];

const suggestedConnections = [
  { id: 1, name: 'Elena Rodriguez', role: 'Pastry Chef', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', mutual: 12 },
  { id: 2, name: 'Michael Brown', role: 'Food Photographer', avatar: 'https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', mutual: 8 },
  { id: 3, name: 'Aisha Patel', role: 'Nutrition Coach', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', mutual: 15 }
];

const HomePage = () => {
  const theme = useTheme();
  const [postContent, setPostContent] = useState('');
  const [feedTab, setFeedTab] = useState(0);
  const [posts, setPosts] = useState(feedPosts);
  const [loading, setLoading] = useState(false);
  
  const handlePostSubmit = (e) => {
    e.preventDefault();
    // In a real app, would send this to the backend
    if (postContent.trim()) {
      const newPost = {
        id: Date.now(),
        author: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80',
        role: 'Culinary Arts Student',
        time: 'Just now',
        content: postContent,
        likes: 0,
        comments: 0,
        shares: 0
      };
      setPosts([newPost, ...posts]);
      setPostContent('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1, liked: true } : post
    ));
  };

  const handleLoadMore = () => {
    setLoading(true);
    // Simulate loading more posts
    setTimeout(() => {
      const newPosts = [
        {
          id: posts.length + 1,
          author: 'Jamie Oliver',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80',
          role: 'Celebrity Chef',
          time: '3 hours ago',
          content: 'Just finished filming a new episode on Italian pasta. The secret to perfect pasta is all in the sauce!',
          image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          likes: 342,
          comments: 87,
          shares: 45
        },
        {
          id: posts.length + 2,
          author: 'Lisa Wong',
          avatar: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
          role: 'Food Blogger',
          time: '5 hours ago',
          content: 'My new vegan sushi recipe is now up on the blog! Who says you need fish to make delicious sushi?',
          image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
          likes: 186,
          comments: 34,
          shares: 21
        }
      ];
      setPosts([...posts, ...newPosts]);
      setLoading(false);
    }, 1500);
  };

  const handleTabChange = (event, newValue) => {
    setFeedTab(newValue);
  };

  // Featured Chef banner section
  const FeaturedBanner = () => (
    <Box 
      sx={{ 
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 4,
        background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)',
      }}
    >
      <Box 
        sx={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100%',
          width: '100%',
          position: 'absolute',
          opacity: 0.2,
        }}
      />
      <Container maxWidth="md">
        <Grid container spacing={2} sx={{ position: 'relative', py: 4 }}>
          <Grid item xs={12} md={7}>
            <Typography variant="overline" sx={{ color: 'white', opacity: 0.8, fontWeight: 600, letterSpacing: 1 }}>
              FEATURED CHEF OF THE WEEK
            </Typography>
            <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
              Elevate Your Culinary Skills
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', opacity: 0.9, mb: 3 }}>
              Join Master Chef Maria Rossi as she shares her exclusive Mediterranean recipes 
              and techniques in her new learning plan.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                color="secondary"
                sx={{ 
                  borderRadius: '24px', 
                  px: 3,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(230, 81, 0, 0.3)'
                }}
              >
                View Learning Plan
              </Button>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderRadius: '24px', 
                  px: 3,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                View Profile
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ 
              position: 'relative', 
              display: { xs: 'none', sm: 'block' } 
            }}>
              <Avatar 
                src="https://images.unsplash.com/photo-1566554273541-37a9ca77b91f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" 
                alt="Maria Rossi"
                sx={{ 
                  width: { sm: 180, md: 200 }, 
                  height: { sm: 180, md: 200 },
                  border: '4px solid white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                }}
              />
              <Box sx={{ 
                position: 'absolute', 
                bottom: -10, 
                right: -10, 
                bgcolor: theme.palette.secondary.main,
                color: 'white',
                borderRadius: '50%',
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                border: '3px solid white'
              }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>4.9</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );

  // Trending categories section
  const TrendingCategories = () => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
          Trending Categories
        </Typography>
        <Button 
          component={Link} 
          to="/recipes" 
          endIcon={<Explore />}
          color="primary"
          sx={{ textTransform: 'none' }}
        >
          Explore All
        </Button>
      </Box>
      <Grid container spacing={2}>
        {[
          { name: 'Italian', image: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80', count: '2.4k recipes' },
          { name: 'Vegan', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80', count: '1.8k recipes' },
          { name: 'Desserts', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', count: '3.2k recipes' },
          { name: 'BBQ', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80', count: '1.1k recipes' },
        ].map((category, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card 
              sx={{ 
                borderRadius: 3, 
                overflow: 'hidden',
                height: 140,
                position: 'relative',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .category-overlay': {
                    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))`,
                  }
                }
              }}
            >
              <Box
                sx={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '100%',
                  width: '100%',
                }}
              />
              <Box
                className="category-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                  transition: 'background 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                  {category.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  {category.count}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #0077B5 0%, #00A0DC 100%)', 
        color: 'white',
        pt: 4,
        pb: 6,
        position: 'relative',
        overflow: 'hidden',
        mb: -4
      }}>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            zIndex: 0
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                Connect, Cook, Create!
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 400, opacity: 0.9 }}>
                Join the CookMate community to discover recipes, learn new skills, and share your culinary adventures.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  component={Link}
                  to="/recipes"
                  sx={{ 
                    bgcolor: 'white', 
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    },
                    borderRadius: 8,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                  }}
                >
                  Explore Recipes
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  component={Link}
                  to="/learning-plans"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                    borderRadius: 8,
                    px: 4,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Learning Plans
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  height: 340,
                  width: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
                  transform: 'rotate(2deg)',
                  border: '8px solid white'
                }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                  alt="Cooking" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }} 
                />
              </Box>
            </Grid>
          </Grid>
          
          {/* Featured Categories Pills */}
          <Box sx={{ 
            mt: 5, 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1.5,
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}>
            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mr: 2, display: 'flex', alignItems: 'center' }}>
              Popular:
            </Typography>
            {['Italian Cuisine', 'Baking', 'Vegetarian', 'Quick Meals', 'Desserts'].map((category) => (
              <Chip
                key={category}
                label={category}
                component={Link}
                to={`/recipes/tag/${category.toLowerCase()}`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)',
                  },
                  borderRadius: 8,
                  px: 1
                }}
                clickable
              />
            ))}
          </Box>
        </Container>
        
        {/* Wave Separator */}
        <Box 
          sx={{ 
            position: 'absolute', 
            bottom: -2, 
            left: 0, 
            right: 0, 
            height: '120px', 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1440 320\'%3E%3Cpath fill=\'%23f8f9fa\' fill-opacity=\'1\' d=\'M0,128L80,138.7C160,149,320,171,480,176C640,181,800,171,960,144C1120,117,1280,75,1360,53.3L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z\'%3E%3C/path%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 2
          }}
        />
      </Box>

      {/* Stats Section */}
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4, position: 'relative', zIndex: 3 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2,
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                1,200+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Recipes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2,
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                450+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Learning Plans
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2,
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                25K+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Active Users
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2,
              borderRadius: 4,
              bgcolor: 'white',
              boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                18K+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Reviews
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl" sx={{ mb: 6 }}>
        {/* Main content section title */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          mt: 6
        }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
            Your Feed
          </Typography>
          <Button 
            variant="outlined"
            component={Link}
            to="/network"
            endIcon={<Explore />}
            sx={{ 
              borderRadius: 8,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Discover More
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {/* Left Sidebar - Hidden on mobile, visible on larger screens */}
          <Grid item md={2} lg={2} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Card sx={{ 
                mb: 3, 
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                }
              }}>
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main, 
                  height: 80,
                  position: 'relative',
                  background: 'linear-gradient(135deg, #0077B5 20%, #00A0DC 80%)'
                }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '-40px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <Avatar
                      sx={{ 
                        width: 80, 
                        height: 80, 
                        border: '4px solid white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                      alt="User Profile"
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80"
                    />
                  </Box>
                </Box>
                <CardContent sx={{ textAlign: 'center', pt: 6, pb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Alex Morgan
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Culinary Arts Student | Food Enthusiast
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
                    <Chip 
                      size="small" 
                      icon={<RestaurantMenu fontSize="small" />} 
                      label="15 Recipes" 
                      sx={{ 
                        mr: 1, 
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }} 
                    />
                    <Chip 
                      size="small" 
                      icon={<School fontSize="small" />} 
                      label="3 Courses" 
                      sx={{ 
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        fontWeight: 500
                      }} 
                    />
                  </Box>
                  
                  <Divider sx={{ mt: 2, mb: 2, mx: -2 }} />
                  
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      color: 'text.primary' 
                    }}>
                      <span>Profile views</span>
                      <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>324</span>
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mb: 1,
                      color: 'text.primary'
                    }}>
                      <span>Recipe views</span>
                      <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>1,289</span>
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      color: 'text.primary'
                    }}>
                      <span>Learning plans</span>
                      <span style={{ fontWeight: 'bold', color: theme.palette.primary.main }}>7</span>
                    </Typography>
                  </Box>
                  
                  <Button 
                    component={Link}
                    to="/profile"
                    variant="outlined" 
                    sx={{ 
                      mt: 3, 
                      borderRadius: 6, 
                      textTransform: 'none',
                      px: 3
                    }}
                  >
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              <Card sx={{ 
                mb: 3, 
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ p: 2, pb: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <School sx={{ mr: 1, color: theme.palette.secondary.main }} />
                      Learning Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You're making great progress!
                    </Typography>
                  </Box>
                  
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      p: 1.5, 
                      borderRadius: 2,
                      mb: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    }}>
                      <Avatar 
                        src="https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" 
                        sx={{ width: 40, height: 40, mr: 1.5 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                          Italian Basics
                        </Typography>
                        <Box sx={{ width: '100%', bgcolor: '#e0e0e0', height: 6, borderRadius: 5 }}>
                          <Box sx={{ 
                            width: '70%', 
                            bgcolor: theme.palette.primary.main, 
                            height: 6, 
                            borderRadius: 5 
                          }} />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          7 of 10 lessons completed
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Button
                      component={Link}
                      to="/learning-plans"
                      variant="contained"
                      fullWidth
                      startIcon={<School />}
                      color="primary"
                      sx={{ 
                        borderRadius: 6,
                        textTransform: 'none',
                        py: 1
                      }}
                    >
                      Continue Learning
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              
              <Card sx={{ 
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.12)'
                }
              }}>
                <Box sx={{ 
                  p: 2, 
                  background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                  color: 'white'
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                    <Whatshot sx={{ mr: 1 }} />
                    Trending Chefs
                  </Typography>
                </Box>
                <List sx={{ py: 0 }}>
                  {suggestedConnections.map((connection) => (
                    <ListItem key={connection.id} disablePadding divider>
                      <ListItemButton sx={{ py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar src={connection.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={connection.name}
                          secondary={connection.role}
                          primaryTypographyProps={{ fontWeight: 500, variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'caption' }}
                        />
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ 
                            minWidth: 0, 
                            p: 0.5,
                            borderRadius: 5,
                            border: `1px solid ${theme.palette.primary.main}`,
                            color: theme.palette.primary.main
                          }}
                        >
                          <Add fontSize="small" />
                        </Button>
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <ListItem sx={{ justifyContent: 'center', py: 1.5 }}>
                    <Button
                      component={Link}
                      to="/network"
                      color="primary"
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      View More
                    </Button>
                  </ListItem>
                </List>
              </Card>
            </Box>
          </Grid>

          {/* Center - Feed */}
          <Grid item xs={12} md={10} lg={10} sx={{ 
            height: { md: 'calc(100vh - 80px)' }, 
            overflowY: { md: 'auto' }, 
            pb: { xs: 7, md: 0 },
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: alpha(theme.palette.primary.main, 0.2),
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: alpha(theme.palette.primary.main, 0.4),
            },
          }}>
            {/* Post creation card */}
            <Card sx={{ 
              p: 0, 
              mb: 3, 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              transition: 'box-shadow 0.3s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }
            }}>
              <Tabs 
                value={feedTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  bgcolor: 'white',
                  borderBottom: 1,
                  borderColor: 'divider',
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    py: 2
                  }
                }}
              >
                <Tab label="For You" />
                <Tab label="Following" />
                <Tab label="Trending" icon={<LocalFireDepartment fontSize="small" color="error" />} iconPosition="end" />
              </Tabs>
              
              <Box sx={{ p: 2.5 }}>
                <form onSubmit={handlePostSubmit}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                    <Avatar 
                      src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=761&q=80" 
                      sx={{ mr: 1.5, mt: 1 }} 
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Share a recipe or cooking tip..."
                      variant="outlined"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          backgroundColor: alpha(theme.palette.grey[100], 0.8),
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.grey[100], 1),
                          },
                          '& fieldset': {
                            borderColor: 'transparent'
                          },
                          '&:hover fieldset': {
                            borderColor: 'transparent'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main
                          }
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 1
                  }}>
                    <Box>
                      <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                        <InsertPhoto fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                        <EmojiEmotions fontSize="small" />
                      </IconButton>
                    </Box>
                    <Button 
                      variant="contained" 
                      type="submit"
                      disabled={!postContent.trim()}
                      sx={{ 
                        borderRadius: 6,
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Post
                    </Button>
                  </Box>
                </form>
              </Box>
            </Card>

            {/* Featured Post (only the first post is styled differently) */}
            {posts.length > 0 && (
              <Card 
                key={posts[0].id} 
                sx={{ 
                  p: 0, 
                  mb: 3, 
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 16px 32px rgba(0,0,0,0.15)'
                  },
                  position: 'relative'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: 6,
                    px: 1.5,
                    py: 0.5,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    zIndex: 2,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }}
                >
                  Featured
                </Box>
                
                <Box sx={{ p: 2.5, pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                      <Avatar src={posts[0].avatar} sx={{ mr: 2, width: 50, height: 50 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {posts[0].author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {posts[0].role}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {posts[0].time}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {posts[0].content}
                  </Typography>
                </Box>
                
                {posts[0].image && (
                  <Box sx={{ width: '100%', height: { xs: 240, sm: 360 }, position: 'relative' }}>
                    <img 
                      src={posts[0].image} 
                      alt="Post attachment" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>
                )}
                
                <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    startIcon={posts[0].liked ? <Favorite color="error" /> : <FavoriteBorder />}
                    onClick={() => handleLike(posts[0].id)}
                    sx={{ 
                      color: posts[0].liked ? 'error.main' : 'text.secondary',
                      textTransform: 'none'
                    }}
                  >
                    {posts[0].likes}
                  </Button>
                  
                  <Button
                    startIcon={<ChatBubbleOutline />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    {posts[0].comments}
                  </Button>
                  
                  <Button
                    startIcon={<Share />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    {posts[0].shares}
                  </Button>
                  
                  <Button
                    startIcon={<BookmarkBorder />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            )}

            {/* Rest of Feed posts */}
            {posts.slice(1).map(post => (
              <Card 
                key={post.id} 
                sx={{ 
                  p: 0, 
                  mb: 3, 
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <Box sx={{ p: 2.5, pb: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex' }}>
                      <Avatar src={post.avatar} sx={{ mr: 2, width: 50, height: 50 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {post.author}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {post.role}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {post.time}
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton size="small">
                      <MoreVert fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.content}
                  </Typography>
                </Box>
                
                {post.image && (
                  <Box sx={{ width: '100%', height: { xs: 200, sm: 320 }, position: 'relative' }}>
                    <img 
                      src={post.image} 
                      alt="Post attachment" 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }} 
                    />
                  </Box>
                )}
                
                <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    startIcon={post.liked ? <Favorite color="error" /> : <FavoriteBorder />}
                    onClick={() => handleLike(post.id)}
                    sx={{ 
                      color: post.liked ? 'error.main' : 'text.secondary',
                      textTransform: 'none'
                    }}
                  >
                    {post.likes}
                  </Button>
                  
                  <Button
                    startIcon={<ChatBubbleOutline />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    {post.comments}
                  </Button>
                  
                  <Button
                    startIcon={<Share />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    {post.shares}
                  </Button>
                  
                  <Button
                    startIcon={<BookmarkBorder />}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                  >
                    Save
                  </Button>
                </Box>
              </Card>
            ))}
            
            {/* Load More */}
            <Box sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleLoadMore}
                disabled={loading}
                sx={{ 
                  borderRadius: 6, 
                  px: 4, 
                  py: 1,
                  fontWeight: 500,
                  textTransform: 'none',
                  borderColor: alpha(theme.palette.primary.main, 0.5)
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 16, 
                        height: 16, 
                        border: '2px solid',
                        borderColor: 'primary.main',
                        borderRadius: '50%',
                        borderRightColor: 'transparent',
                        animation: 'spin 1s linear infinite',
                        mr: 1,
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} 
                    />
                    Loading...
                  </Box>
                ) : 'Load More Posts'}
              </Button>
            </Box>

            {/* Footer Section */}
            <Box sx={{ mt: 3, p: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                © 2023 CookMate - Connect with Chefs
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <MuiLink href="#" color="textSecondary" underline="hover" sx={{ typography: 'caption' }}>
                  Privacy
                </MuiLink>
                <MuiLink href="#" color="textSecondary" underline="hover" sx={{ typography: 'caption' }}>
                  Terms
                </MuiLink>
                <MuiLink href="#" color="textSecondary" underline="hover" sx={{ typography: 'caption' }}>
                  Help
                </MuiLink>
              </Box>
            </Box>
          </Grid>
          
          {/* Mobile bottom navigation - visible only on mobile */}
          <Box 
            sx={{ 
              position: 'fixed', 
              bottom: 0, 
              left: 0,
              right: 0,
              bgcolor: 'white',
              borderTop: '1px solid',
              borderColor: 'divider',
              zIndex: 1000,
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'space-around',
              py: 1,
              boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}
          >
            <IconButton component={Link} to="/" color="primary">
              <HomeRounded />
            </IconButton>
            <IconButton component={Link} to="/recipes">
              <SearchRounded />
            </IconButton>
            <IconButton 
              component={Link} 
              to="/recipes/add"
              sx={{
                bgcolor: theme.palette.primary.main,
                color: 'white',
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                },
                transform: 'translateY(-8px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <AddCircleOutline sx={{ fontSize: 28 }} />
            </IconButton>
            <IconButton>
              <NotificationsRounded />
            </IconButton>
            <IconButton component={Link} to="/profile">
              <PersonRounded />
            </IconButton>
          </Box>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 