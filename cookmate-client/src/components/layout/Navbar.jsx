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
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  BookmarkBorder as BookmarkIcon,
  ExitToApp as LogoutIcon,
  Create as CreateIcon,
  ArrowForwardIos as ArrowIcon,
  CameraAlt as CameraIcon,
  Cake as CakeIcon,
  Comment as CommentIcon,
  Favorite as LikeIcon,
  Star as RatingIcon,
  School as LearningIcon,
  GroupAdd as FollowIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationService from '../../services/notificationService';
import { formatDistanceToNow } from 'date-fns';
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
  backgroundClip: 'text',
  textFillColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
}));

const Navbar = () => {
  const theme = useTheme();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated, logout } = useAuth();
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState(null);

  // Fetch notifications on component mount
  useEffect(() => {
    // Only fetch if authenticated and user exists
    if (isAuthenticated && currentUser?.id) {
      console.log("Navbar: Fetching initial notifications for user", currentUser.id);
      fetchNotifications();
      
      // Setup interval to check for new notifications (every 30 seconds)
      const interval = setInterval(() => {
        // Check authentication status before each fetch attempt
        if (isAuthenticated && currentUser?.id) {
          fetchNotificationCount();
        } else {
          console.log("Navbar: Skipping notification check - user not authenticated");
        }
      }, 30000);
      
      // Clear interval on component unmount
      return () => clearInterval(interval);
    } else {
      console.log("Navbar: User not authenticated, skipping notification fetch");
    }
  }, [isAuthenticated, currentUser?.id]); // Only re-run if auth status or user ID changes

  // Fetch all notifications for the user
  const fetchNotifications = async () => {
    // Double-check authentication to prevent unnecessary API calls
    if (!isAuthenticated || !currentUser?.id) {
      console.log("Navbar: fetchNotifications called but user not authenticated");
      return;
    }
    
    try {
      setLoadingNotifications(true);
      setNotificationError(null);
      
      console.log("Navbar: Fetching notifications for user", currentUser.id);
      const data = await NotificationService.getNotificationsByUser(currentUser.id);
      
      // Map backend notifications to UI format
      const formattedNotifications = data.map(notification => ({
        id: notification.id,
        content: notification.message,
        time: formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }),
        read: notification.read,
        type: notification.type,
        resourceId: notification.resourceId,
        resourceType: notification.resourceType,
        senderId: notification.senderId,
        icon: getNotificationIcon(notification.type)
      }));
      
      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotificationError('Failed to load notifications');
      
      // Only use mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.log("Navbar: Using mock notifications (development only)");
        setNotifications(getMockNotifications());
        setUnreadCount(getMockNotifications().filter(n => !n.read).length);
      }
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Fetch only the unread count
  const fetchNotificationCount = async () => {
    // Double-check authentication to prevent unnecessary API calls
    if (!isAuthenticated || !currentUser?.id) {
      console.log("Navbar: fetchNotificationCount called but user not authenticated");
      return;
    }
    
    try {
      console.log("Navbar: Fetching notification count for user", currentUser.id);
      const count = await NotificationService.getUnreadNotificationCount(currentUser.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch notification count:', error);
      // Keep the previous count on error
    }
  };

  // Mark a notification as read
  const markNotificationAsRead = async (notificationId) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      
      // Update the unread count
      setUnreadCount(prevCount => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error(`Failed to mark notification as read:`, error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(currentUser.id);
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset the unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Get the appropriate icon for each notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'LIKE':
        return <LikeIcon fontSize="small" sx={{ color: '#e91e63' }} />;
      case 'COMMENT':
        return <CommentIcon fontSize="small" sx={{ color: '#2196f3' }} />;
      case 'RECIPE':
        return <RestaurantIcon fontSize="small" sx={{ color: '#ff9800' }} />;
      case 'FOLLOW':
        return <FollowIcon fontSize="small" sx={{ color: '#9c27b0' }} />;
      case 'LEARNING_PLAN':
        return <LearningIcon fontSize="small" sx={{ color: '#4caf50' }} />;
      case 'RATING':
        return <RatingIcon fontSize="small" sx={{ color: '#ffc107' }} />;
      case 'VIEW':
        return <ViewIcon fontSize="small" sx={{ color: '#607d8b' }} />;
      default:
        return <NotificationsIcon fontSize="small" sx={{ color: '#9e9e9e' }} />;
    }
  };

  // Mock notifications for development
  const getMockNotifications = () => [
    {
      id: '1',
      content: 'Sarah Johnson liked your Chocolate Cake recipe',
      time: '5 min ago',
      read: false,
      type: 'LIKE',
      resourceId: 'recipe-123',
      resourceType: 'RECIPE',
      icon: getNotificationIcon('LIKE')
    },
    {
      id: '2',
      content: 'New comment on your Italian Pasta recipe',
      time: '2 hours ago',
      read: false,
      type: 'COMMENT',
      resourceId: 'recipe-456',
      resourceType: 'RECIPE',
      icon: getNotificationIcon('COMMENT')
    },
    {
      id: '3',
      content: 'Your Mediterranean Salad is trending!',
      time: 'Yesterday',
      read: true,
      type: 'VIEW',
      resourceId: 'recipe-789',
      resourceType: 'RECIPE',
      icon: getNotificationIcon('VIEW')
    },
    {
      id: '4',
      content: 'Alex Morgan started following you',
      time: '2 days ago',
      read: true,
      type: 'FOLLOW',
      resourceId: 'user-123',
      resourceType: 'USER',
      icon: getNotificationIcon('FOLLOW')
    }
  ];

  // Handle clicking on a notification
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    
    // Navigate to the appropriate page based on notification type
    handleCloseNotificationsMenu();
    
    if (notification.resourceType === 'RECIPE') {
      navigate(`/recipes/${notification.resourceId}`);
    } else if (notification.resourceType === 'LEARNING_PLAN') {
      navigate(`/learning-plans/${notification.resourceId}`);
    } else if (notification.resourceType === 'USER') {
      navigate(`/profile/${notification.senderId}`);
    } else {
      navigate('/notifications');
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
    // Fetch fresh notifications when opening the menu
    fetchNotifications();
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'Learning Plans', path: '/learning-plans' },
    { name: 'Network', path: '/network' }
  ];
  
  const settings = [
    { name: 'Profile', path: '/profile', icon: <PersonIcon fontSize="small" /> },
    { name: 'My Recipes', path: '/my-recipes', icon: <RestaurantIcon fontSize="small" /> },
    { name: 'My Learning Plans', path: '/my-learning-plans', icon: <BookmarkIcon fontSize="small" /> },
    { name: 'Settings', path: '/settings', icon: <SettingsIcon fontSize="small" /> },
    { name: 'Logout', path: '/logout', icon: <LogoutIcon fontSize="small" /> }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setAnchorElUser(null);
  };

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
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 3 }}>
            <RestaurantIcon 
              sx={{ 
                mr: 1, 
                fontSize: '2rem', 
                color: theme.palette.secondary.main 
              }} 
            />
            <LogoText
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                textDecoration: 'none',
              }}
            >
              COOKMATE
            </LogoText>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={() => {
                  handleCloseNavMenu();
                  navigate(page.path);
                }}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <RestaurantIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
            <LogoText
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: 'none',
              }}
            >
              COOKMATE
            </LogoText>
          </Box>
          
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
                  borderRadius: 0,
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

          <Search sx={{ 
            borderRadius: '24px', 
            backgroundColor: alpha(theme.palette.grey[200], 0.75),
            '&:hover': {
              backgroundColor: alpha(theme.palette.grey[200], 1),
            }, 
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

                <Tooltip title="Notifications">
                  <IconButton 
                    size="large" 
                    color="inherit"
                    onClick={handleOpenNotificationsMenu}
                    aria-label="notifications"
                  >
                    <StyledBadge badgeContent={unreadCount} color="error">
                      <NotificationsIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="notifications-menu"
                  anchorEl={anchorElNotifications}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElNotifications)}
                  onClose={handleCloseNotificationsMenu}
                  PaperProps={{
                    sx: { width: 320, maxHeight: 400, overflow: 'auto' }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={600}>Notifications</Typography>
                    <Button 
                      size="small" 
                      sx={{ textTransform: 'none' }}
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadCount === 0 || loadingNotifications}
                    >
                      Mark all as read
                    </Button>
                  </Box>
                  <Divider />
                  
                  {loadingNotifications ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : notificationError ? (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography color="error">{notificationError}</Typography>
                    </Box>
                  ) : notifications.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">No notifications yet</Typography>
                    </Box>
                  ) : (
                    notifications.map((notification) => (
                      <MenuItem 
                        key={notification.id} 
                        onClick={() => handleNotificationClick(notification)}
                        sx={{ 
                          py: 1.5, 
                          px: 2,
                          backgroundColor: notification.read ? 'transparent' : alpha(theme.palette.primary.main, 0.05)
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            {notification.icon}
                          </ListItemIcon>
                          <Box sx={{ ml: 1 }}>
                            <Typography variant="body2">{notification.content}</Typography>
                            <Typography variant="caption" color="text.secondary">{notification.time}</Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                  
                  <Divider />
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Button 
                      onClick={() => {
                        handleCloseNotificationsMenu();
                        navigate('/notifications');
                      }}
                      sx={{ textTransform: 'none' }}
                    >
                      View all notifications
                    </Button>
                  </Box>
                </Menu>

                <IconButton size="large" color="inherit" sx={{ mx: { xs: 0.5, md: 1 } }}>
                  <Badge badgeContent={2} color="error">
                    <MessageIcon />
                  </Badge>
                </IconButton>
              </Box>

              <Box sx={{ flexGrow: 0, ml: { xs: 0.5, md: 1 } }}>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ p: 0, ml: 1 }}
                    aria-label="user account"
                  >
                    <Avatar 
                      alt={currentUser?.name || 'User'} 
                      src={currentUser?.profilePicture}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        border: '2px solid white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  PaperProps={{
                    elevation: 3,
                    sx: { width: 250 }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, textAlign: 'center' }}>
                    <Avatar 
                      alt={currentUser?.name || 'User'} 
                      src={currentUser?.profilePicture}
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto',
                        border: '3px solid white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                      {currentUser?.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.email || ''}
                    </Typography>
                  </Box>
                  <Divider />
                  {settings.filter(setting => setting.name !== 'Logout').map((setting) => (
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
              <Button 
                component={Link} 
                to="/login"
                color="inherit"
                sx={{ mx: 1 }}
              >
                Login
              </Button>
              <Button 
                component={Link} 
                to="/register"
                variant="contained" 
                color="secondary"
              >
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