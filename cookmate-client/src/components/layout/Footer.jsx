import { Box, Container, Typography, Link, Grid, IconButton, Button, Divider, useTheme } from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Pinterest, 
  YouTube,
  Apple,
  Android,
  ArrowForward,
  RestaurantMenu,
  MailOutline
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        pt: 6,
        pb: 3,
        backgroundColor: '#1c1c1c',
        color: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={5} lg={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RestaurantMenu sx={{ fontSize: 28, color: theme.palette.secondary.main, mr: 1 }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(to right, #e65100, #ff8f00)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                COOKMATE
              </Typography>
            </Box>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2, maxWidth: 450 }}>
              Connect with cooking enthusiasts worldwide. Share recipes, learn new skills, 
              and grow your culinary network on the leading social platform for food lovers.
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="grey.300" sx={{ mb: 1.5 }}>
                Join our newsletter
              </Typography>
              <Box sx={{ 
                display: 'flex',
                borderRadius: 2,
                overflow: 'hidden',
                maxWidth: 400,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Box 
                  component="input"
                  placeholder="Your email address"
                  sx={{ 
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    p: 1.5,
                    pl: 2,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: 'white',
                    fontSize: '0.9rem',
                    '&::placeholder': {
                      color: 'grey.500'
                    }
                  }}
                />
                <Button 
                  sx={{ 
                    borderRadius: 0,
                    px: 2,
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark
                    }
                  }} 
                  variant="contained"
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="grey.300" sx={{ mb: 1.5 }}>
                Follow us
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#1877F2', color: 'white' }
                  }}
                >
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#1DA1F2', color: 'white' }
                  }}
                >
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { 
                      backgroundImage: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
                      color: 'white' 
                    }
                  }}
                >
                  <Instagram fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#E60023', color: 'white' }
                  }}
                >
                  <Pinterest fontSize="small" />
                </IconButton>
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: '#FF0000', color: 'white' }
                  }}
                >
                  <YouTube fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Explore
            </Typography>
            <Box component="nav">
              {['Recipes', 'Learning Plans', 'Community', 'Culinary Schools', 'Events'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  underline="none"
                  sx={{ 
                    display: 'block', 
                    color: 'grey.400',
                    py: 0.8,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      color: theme.palette.secondary.main,
                      pl: 0.5
                    } 
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={2} lg={2}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Information
            </Typography>
            <Box component="nav">
              {['About Us', 'Careers', 'Partner With Us', 'Advertise', 'Press Kit'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  underline="none"
                  sx={{ 
                    display: 'block', 
                    color: 'grey.400',
                    py: 0.8,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      color: theme.palette.secondary.main,
                      pl: 0.5
                    } 
                  }}
                >
                  {item}
                </Link>
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4} md={3} lg={3}>
            <Typography variant="subtitle1" color="white" gutterBottom fontWeight={600}>
              Get the App
            </Typography>
            <Typography variant="body2" color="grey.400" sx={{ mb: 2 }}>
              Take CookMate with you wherever you go
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<Apple />}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.3)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Download on the App Store
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<Android />}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.3)',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Get it on Google Play
              </Button>
            </Box>
            
            <Typography variant="subtitle2" color="grey.300" sx={{ mb: 1 }}>
              Contact Us
            </Typography>
            <Link 
              href="mailto:hello@cookmate.com" 
              underline="none"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.secondary.main,
                mb: 1
              }}
            >
              <MailOutline fontSize="small" sx={{ mr: 1 }} />
              hello@cookmate.com
            </Link>
          </Grid>
        </Grid>
        
        <Divider sx={{ mt: 5, mb: 3, borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="body2" color="grey.500" sx={{ mb: { xs: 2, sm: 0 } }}>
            © {new Date().getFullYear()} CookMate. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((item) => (
              <Link 
                key={item}
                href={`/${item.toLowerCase()}`} 
                underline="none"
                sx={{ 
                  color: 'grey.500',
                  fontSize: '0.875rem',
                  '&:hover': { color: theme.palette.secondary.main } 
                }}
              >
                {item}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 