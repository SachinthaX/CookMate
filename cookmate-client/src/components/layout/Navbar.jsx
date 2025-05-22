import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu,
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  InputBase,
  Badge,
  useTheme,
  alpha,
  Divider,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Restaurant as RestaurantIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  BookmarkBorder as BookmarkIcon,
  ExitToApp as LogoutIcon,
  Create as CreateIcon,
  Comment as CommentIcon,
  Favorite as LikeIcon,
  Star as RatingIcon,
  School as LearningIcon,
  GroupAdd as FollowIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    fontWeight: 'bold',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 700,
  letterSpacing: '0.05rem',
  background: 'linear-gradient(to right, #e65100, #ff8f00)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
}));

const Navbar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setAnchorElUser(null);
  };

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Learning Plans', path: '/learning-plans' },
    // removed Network
  ];

  const settings = [
    { name: 'Profile', path: '/profile', icon: <PersonIcon fontSize="small" /> },
    { name: 'My Recipes', path: '/my-recipes', icon: <RestaurantIcon fontSize="small" /> },
    { name: 'My Learning Plans', path: '/my-learning-plans', icon: <BookmarkIcon fontSize="small" /> },
    // removed Settings
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white', 
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        <Toolbar disableGutters sx={{ px: { xs: 1, sm: 2, md: 3 }, py: 0.5, maxWidth: 1600, width: '100%', mx: 'auto' }}>
          {/* logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 3 }}>
            <RestaurantIcon sx={{ mr: 1, fontSize: '2rem', color: theme.palette.secondary.main }} />
            <LogoText variant="h5" noWrap component={Link} to="/" sx={{ mr: 2, textDecoration: 'none' }}>
              COOKMATE
            </LogoText>
          </Box>

          {/* mobile menu button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" aria-label="menu" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => { handleCloseNavMenu(); navigate(page.path); }}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <LogoText variant="h6" noWrap component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none' }}>
              COOKMATE
            </LogoText>
          </Box>

          {/* desktop nav links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ 
                  mx: 0.5, 
                  color: location.pathname === page.path ? theme.palette.primary.main : 'text.secondary',
                  fontWeight: location.pathname === page.path ? 600 : 400,
                  borderBottom: location.pathname === page.path ? `2px solid ${theme.palette.primary.main}` : 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: theme.palette.primary.main,
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* search bar */}
          <Search sx={{ 
            borderRadius: '24px', 
            backgroundColor: alpha(theme.palette.grey[200], 0.75),
            '&:hover': { backgroundColor: alpha(theme.palette.grey[200], 1) }, 
            mr: { xs: 1, md: 2 },
            ml: { xs: 'auto', md: 0 },
            maxWidth: { xs: 150, sm: 'unset' }
          }}>
            <SearchIconWrapper>
              <SearchIcon color="action" />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search recipes, chefs..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>

          {isAuthenticated && currentUser ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  color="secondary"
                  startIcon={<CreateIcon />}
                  component={Link}
                  to="/recipes/add"
                  sx={{ 
                    borderRadius: '20px',
                    display: { xs: 'none', md: 'flex' },
                    mr: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 2
                  }}
                >
                  Create Recipe
                </Button>

                {/* removed Notifications Icon & menu */}
                {/* removed Messages Icon */}
              </Box>

              {/* user avatar & dropdown */}
              <Box sx={{ flexGrow: 0, ml: { xs: 0.5, md: 1 } }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1 }} aria-label="user account">
                    <Avatar 
                      alt={currentUser?.name || 'User'} 
                      src={currentUser?.profilePicture}
                      sx={{ width: 40, height: 40, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  keepMounted
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{ elevation: 3, sx: { width: 250 } }}
                >
                  <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                    <Avatar 
                      alt={currentUser?.name || 'User'} 
                      src={currentUser?.profilePicture}
                      sx={{ width: 60, height: 60, mx: 'auto', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                      {currentUser?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.email || ''}
                    </Typography>
                  </Box>
                  <Divider />
                  {settings.map((setting) => (
                    <MenuItem key={setting.name} onClick={() => {
                      handleCloseUserMenu();
                      navigate(setting.path);
                    }} sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {setting.icon}
                      </ListItemIcon>
                      <ListItemText primary={setting.name} />
                    </MenuItem>
                  ))}
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex' }}>
              <Button component={Link} to="/login" color="inherit" sx={{ mx: 1 }}>
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained" color="secondary">
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default Navbar;
