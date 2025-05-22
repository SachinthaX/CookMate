import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton
} from '@mui/material';
import {
  Person,
  Lock,
  Notifications,
  Palette,
  Language,
  AccountCircle,
  Delete,
  Save,
  PhotoCamera,
  Email,
  Phone,
  Cookie
} from '@mui/icons-material';

const SettingsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8901',
    bio: 'Food enthusiast and amateur chef. I love experimenting with new recipes and techniques.',
    avatar: 'https://source.unsplash.com/random/150x150/?portrait'
  });
  
  const [preferences, setPreferences] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: true,
    weeklyNewsletter: true,
    recipeUpdates: true,
    mealReminderAlerts: false,
    language: 'English',
    cookieConsent: true
  });
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handlePreferenceToggle = (name) => {
    setPreferences({
      ...preferences,
      [name]: !preferences[name]
    });
  };
  
  const handleSubmitProfile = (e) => {
    e.preventDefault();
    // In a real app, would send to backend
    console.log('Profile data submitted:', profileData);
    // Show success message
  };
  
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<Person />} label="Profile" />
          <Tab icon={<Lock />} label="Security" />
          <Tab icon={<Notifications />} label="Notifications" />
          <Tab icon={<Palette />} label="Preferences" />
        </Tabs>
      </Paper>
      
      {/* Profile Settings */}
      {tabValue === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmitProfile}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={profileData.avatar} 
                sx={{ width: 100, height: 100, mr: 3 }}
              />
              <Box>
                <Typography variant="h6" gutterBottom>
                  Profile Picture
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                >
                  Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                  />
                </Button>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  InputProps={{
                    startAdornment: <Email color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  InputProps={{
                    startAdornment: <Phone color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  helperText="Tell others about yourself and your culinary interests"
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Delete />}
                  >
                    Delete Account
                  </Button>
                  <Button 
                    variant="contained" 
                    type="submit"
                    startIcon={<Save />}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      )}
      
      {/* Security Settings */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Password
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </Typography>
              <Button variant="contained">
                Update Password
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <FormControlLabel
              control={<Switch />}
              label="Enable two-factor authentication"
            />
            <Typography variant="body2" color="text.secondary">
              Add an extra layer of security to your account by requiring more than just a password to sign in.
            </Typography>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Login Sessions
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText 
                  primary="Current session (Chrome on Windows)" 
                  secondary="Active now" 
                />
                <Typography variant="body2" color="success.main">
                  Current
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText 
                  primary="iPhone Safari" 
                  secondary="Last active: Yesterday" 
                />
                <Button size="small" color="error">
                  Log Out
                </Button>
              </ListItem>
            </List>
          </Box>
        </Paper>
      )}
      
      {/* Notification Settings */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Email Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Email Notifications" 
                secondary="Receive emails about your account activity and updates" 
              />
              <Switch 
                checked={preferences.emailNotifications}
                onChange={() => handlePreferenceToggle('emailNotifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Weekly Newsletter" 
                secondary="Get weekly updates on new recipes and cooking tips" 
              />
              <Switch 
                checked={preferences.weeklyNewsletter}
                onChange={() => handlePreferenceToggle('weeklyNewsletter')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Recipe Updates" 
                secondary="Get notified when creators you follow post new recipes" 
              />
              <Switch 
                checked={preferences.recipeUpdates}
                onChange={() => handlePreferenceToggle('recipeUpdates')}
              />
            </ListItem>
          </List>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Push Notifications
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Push Notifications" 
                secondary="Receive notifications on your device" 
              />
              <Switch 
                checked={preferences.pushNotifications}
                onChange={() => handlePreferenceToggle('pushNotifications')}
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Meal Reminder Alerts" 
                secondary="Get reminders for scheduled meal preparations" 
              />
              <Switch 
                checked={preferences.mealReminderAlerts}
                onChange={() => handlePreferenceToggle('mealReminderAlerts')}
              />
            </ListItem>
          </List>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained">
              Save Notification Settings
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Preferences Settings */}
      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>
          <FormControlLabel
            control={
              <Switch 
                checked={preferences.darkMode}
                onChange={() => handlePreferenceToggle('darkMode')}
              />
            }
            label="Dark Mode"
          />
          <Typography variant="body2" color="text.secondary">
            Switch between light and dark color themes
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Language
            </Typography>
            <TextField
              select
              fullWidth
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              SelectProps={{
                native: true,
              }}
              InputProps={{
                startAdornment: <Language color="action" sx={{ mr: 1 }} />
              }}
            >
              {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Privacy
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Cookie />
                </ListItemIcon>
                <ListItemText 
                  primary="Cookie Preferences" 
                  secondary="Manage how we use cookies to enhance your experience" 
                />
                <Switch 
                  checked={preferences.cookieConsent}
                  onChange={() => handlePreferenceToggle('cookieConsent')}
                />
              </ListItem>
            </List>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained">
              Save Preferences
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default SettingsPage; 