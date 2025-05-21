import { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Notifications as NotificationsIcon,
  Comment as CommentIcon,
  Favorite as LikeIcon,
  Star as RatingIcon,
  School as LearningIcon,
  GroupAdd as FollowIcon,
  Visibility as ViewIcon,
  ArrowBack as BackIcon,
  MoreVert as MoreIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  CheckCircle as ReadIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationService from '../services/notificationService';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage = () => {
  const navigate = useNavigate();
  
  // State variables
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0); // 0 = all, 1 = unread
  const [filterType, setFilterType] = useState('all');
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  
  // Mock user ID (replace with real authentication)
  const currentUserId = 'current-user-id';
  
  // Fetch notifications when component mounts or filter changes
  useEffect(() => {
    fetchNotifications();
  }, [tabValue, filterType]);
  
  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      if (tabValue === 0) {
        data = await NotificationService.getNotificationsByUser(currentUserId);
      } else {
        data = await NotificationService.getUnreadNotifications(currentUserId);
      }
      
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
        createdAt: notification.createdAt
      }));
      
      // Apply type filter if needed
      let filteredData = formattedNotifications;
      if (filterType !== 'all') {
        filteredData = formattedNotifications.filter(notification => 
          notification.type === filterType
        );
      }
      
      // Sort by date (newest first)
      filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setNotifications(filteredData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setError('Failed to load notifications. Please try again later.');
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        setNotifications(getMockNotifications());
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Mark a notification as read
  const markAsRead = async (notificationId) => {
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
    } catch (error) {
      console.error(`Failed to mark notification as read:`, error);
      setError('Failed to mark as read. Please try again.');
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead(currentUserId);
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      setError('Failed to mark all as read. Please try again.');
    }
  };
  
  // Delete a notification
  const deleteNotification = async (notificationId) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      // Update the local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      // Close the action menu
      setActionMenuAnchor(null);
    } catch (error) {
      console.error(`Failed to delete notification:`, error);
      setError('Failed to delete notification. Please try again.');
    }
  };
  
  // Handle notification click - navigate to the resource
  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate to the appropriate page
    if (notification.resourceType === 'RECIPE') {
      navigate(`/recipes/${notification.resourceId}`);
    } else if (notification.resourceType === 'LEARNING_PLAN') {
      navigate(`/learning-plans/${notification.resourceId}`);
    } else if (notification.resourceType === 'USER') {
      navigate(`/profile/${notification.senderId}`);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (type) => {
    setFilterType(type);
    setFilterMenuAnchor(null);
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Open action menu for a notification
  const handleOpenActionMenu = (event, notification) => {
    event.stopPropagation();
    setSelectedNotification(notification);
    setActionMenuAnchor(event.currentTarget);
  };
  
  // Open filter menu
  const handleOpenFilterMenu = (event) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  // Get icon for notification type
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
  
  // Get label for notification type
  const getTypeLabel = (type) => {
    switch (type) {
      case 'LIKE': return 'Like';
      case 'COMMENT': return 'Comment';
      case 'RECIPE': return 'Recipe';
      case 'FOLLOW': return 'Follow';
      case 'LEARNING_PLAN': return 'Learning Plan';
      case 'RATING': return 'Rating';
      case 'VIEW': return 'View';
      default: return 'Notification';
    }
  };
  
  // Get mock notifications for development
  const getMockNotifications = () => [
    {
      id: '1',
      content: 'Sarah Johnson liked your Chocolate Cake recipe',
      time: '5 min ago',
      read: false,
      type: 'LIKE',
      resourceId: 'recipe-123',
      resourceType: 'RECIPE',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      content: 'New comment on your Italian Pasta recipe',
      time: '2 hours ago',
      read: false,
      type: 'COMMENT',
      resourceId: 'recipe-456',
      resourceType: 'RECIPE',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      content: 'Your Mediterranean Salad is trending!',
      time: 'Yesterday',
      read: true,
      type: 'VIEW',
      resourceId: 'recipe-789',
      resourceType: 'RECIPE',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '4',
      content: 'Alex Morgan started following you',
      time: '2 days ago',
      read: true,
      type: 'FOLLOW',
      resourceId: 'user-123',
      resourceType: 'USER',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '5',
      content: 'Your Italian Cooking Basics learning plan has a new follower',
      time: '3 days ago',
      read: true,
      type: 'LEARNING_PLAN',
      resourceId: 'plan-123',
      resourceType: 'LEARNING_PLAN',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Notifications
        </Typography>
      </Box>
      
      <Paper elevation={1} sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          px: 2,
          py: 1
        }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="notification tabs">
            <Tab label="All" />
            <Tab label="Unread" />
          </Tabs>
          
          <Box>
            <Button 
              onClick={markAllAsRead}
              startIcon={<ReadIcon />}
              disabled={!notifications.some(n => !n.read)}
              sx={{ mr: 1 }}
              size="small"
            >
              Mark all as read
            </Button>
            
            <Button
              startIcon={<FilterIcon />}
              onClick={handleOpenFilterMenu}
              size="small"
            >
              Filter
            </Button>
            <Menu
              anchorEl={filterMenuAnchor}
              open={Boolean(filterMenuAnchor)}
              onClose={() => setFilterMenuAnchor(null)}
            >
              <MenuItem onClick={() => handleFilterChange('all')} selected={filterType === 'all'}>
                All types
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange('LIKE')} selected={filterType === 'LIKE'}>
                <LikeIcon fontSize="small" sx={{ mr: 1, color: '#e91e63' }} />
                Likes
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange('COMMENT')} selected={filterType === 'COMMENT'}>
                <CommentIcon fontSize="small" sx={{ mr: 1, color: '#2196f3' }} />
                Comments
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange('FOLLOW')} selected={filterType === 'FOLLOW'}>
                <FollowIcon fontSize="small" sx={{ mr: 1, color: '#9c27b0' }} />
                Follows
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange('RECIPE')} selected={filterType === 'RECIPE'}>
                <RestaurantIcon fontSize="small" sx={{ mr: 1, color: '#ff9800' }} />
                Recipes
              </MenuItem>
              <MenuItem onClick={() => handleFilterChange('LEARNING_PLAN')} selected={filterType === 'LEARNING_PLAN'}>
                <LearningIcon fontSize="small" sx={{ mr: 1, color: '#4caf50' }} />
                Learning Plans
              </MenuItem>
            </Menu>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
        ) : notifications.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {filterType !== 'all' 
                ? `No ${getTypeLabel(filterType).toLowerCase()} notifications found`
                : tabValue === 1 
                  ? 'No unread notifications'
                  : 'No notifications yet'}
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem 
                  alignItems="flex-start"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{ 
                    py: 2,
                    cursor: 'pointer',
                    backgroundColor: notification.read ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="notification actions"
                      onClick={(e) => handleOpenActionMenu(e, notification)}
                    >
                      <MoreIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon sx={{ mt: 0.5 }}>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <Typography
                          component="span"
                          variant="body1"
                          sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                        >
                          {notification.content}
                        </Typography>
                        <Chip
                          label={getTypeLabel(notification.type)}
                          size="small"
                          sx={{ 
                            ml: 1,
                            height: 20,
                            fontSize: '0.7rem',
                            backgroundColor: notification.type === 'LIKE' ? 'rgba(233, 30, 99, 0.1)' :
                                            notification.type === 'COMMENT' ? 'rgba(33, 150, 243, 0.1)' :
                                            notification.type === 'RECIPE' ? 'rgba(255, 152, 0, 0.1)' :
                                            notification.type === 'FOLLOW' ? 'rgba(156, 39, 176, 0.1)' :
                                            notification.type === 'LEARNING_PLAN' ? 'rgba(76, 175, 80, 0.1)' :
                                            'rgba(158, 158, 158, 0.1)',
                            color: notification.type === 'LIKE' ? '#e91e63' :
                                   notification.type === 'COMMENT' ? '#2196f3' :
                                   notification.type === 'RECIPE' ? '#ff9800' :
                                   notification.type === 'FOLLOW' ? '#9c27b0' :
                                   notification.type === 'LEARNING_PLAN' ? '#4caf50' :
                                   '#9e9e9e',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {notification.time}
                      </Typography>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Action menu for individual notifications */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
      >
        {selectedNotification && !selectedNotification.read && (
          <MenuItem onClick={() => {
            markAsRead(selectedNotification.id);
            setActionMenuAnchor(null);
          }}>
            <ListItemIcon>
              <ReadIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as read</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedNotification) {
            deleteNotification(selectedNotification.id);
          }
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default NotificationsPage; 