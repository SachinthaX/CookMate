import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  useTheme
} from "@mui/material";
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  AddCircleOutline,
  LockOpen,
  DeleteForever
} from "@mui/icons-material";
import API from "../services/api";
import toast from "react-hot-toast";
import ChatBot from "./ChatBot";

const defaultAvatar = "/images/default-avatar.png";
const USERS_PER_PAGE = 12;

// A small card to show each user with follow/unfollow
const FriendCard = ({ user, followingList, onFollow, onUnfollow }) => {
  const isFollowing = followingList?.includes(user.id);
  return (
    <Paper elevation={1} sx={{ p: 2, borderRadius: 2, textAlign: 'center' }}>
      <Avatar
        src={user.profilePicture || defaultAvatar}
        alt={user.name}
        sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
      />
      <Typography fontWeight="bold">{user.name}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {user.email}
      </Typography>
      {isFollowing ? (
        <Button size="small" variant="outlined" onClick={() => onUnfollow(user.id)}>
          Unfollow
        </Button>
      ) : (
        <Button size="small" variant="contained" onClick={() => onFollow(user.id)}>
          Follow
        </Button>
      )}
    </Paper>
  );
};

const ProfilePage = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "", phoneNumber: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUrlInput, setAvatarUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [changingPass, setChangingPass] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch current user and all users
  useEffect(() => {
    API.get("/users/me")
      .then((res) => {
        setUser(res.data);
        setEditData({
          name: res.data.name || "",
          bio: res.data.bio || "",
          phoneNumber: res.data.phoneNumber || ""
        });
        setAvatarPreview(res.data.profilePicture || defaultAvatar);
      })
      .catch(() => toast.error("Failed to load profile"));
    API.get("/users")
      .then((res) => setAllUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  }, []);

  if (!user) return (
    <Box display="flex" alignItems="center" justifyContent="center" height="60vh">
      <Typography variant="h6">Loading Profile...</Typography>
    </Box>
  );

  // Lists for tabs
  const suggestions = allUsers
    .filter(u => u.id !== user.id && !user.following?.includes(u.id) &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
       u.email.toLowerCase().includes(search.toLowerCase())))
    .slice(0, USERS_PER_PAGE);
  const followingList = allUsers.filter(u => user.following?.includes(u.id));
  const followersList = allUsers.filter(u => user.followers?.includes(u.id));

  // Follow/unfollow
  const handleFollow = async (id) => {
    try {
      await API.put(`/users/${id}/follow`);
      toast.success("Followed!");
      // Refresh data
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch {
      toast.error("Follow failed!");
    }
  };
  const handleUnfollow = async (id) => {
    try {
      await API.put(`/users/${id}/unfollow`);
      toast.success("Unfollowed!");
      const res = await API.get("/users/me");
      setUser(res.data);
    } catch {
      toast.error("Unfollow failed!");
    }
  };

  // Edit profile
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrlInput("");
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  const handleSaveProfile = async () => {
    try {
      let profilePicture = user.profilePicture;
      if (avatarUrlInput.trim()) {
        profilePicture = avatarUrlInput.trim();
      } else if (avatarFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", avatarFile);
        const uploadRes = await API.post("/users/me/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        profilePicture = uploadRes.data;
        setUploading(false);
      }
      const res = await API.put("/users/me", { ...editData, profilePicture });
      setUser(res.data);
      setEditOpen(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed.");
      setUploading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (!oldPass || !newPass || newPass !== confirmPass) {
      toast.error("Passwords must match and not be empty");
      return;
    }
    setChangingPass(true);
    try {
      await API.put("/users/me/change-password", { oldPassword: oldPass, newPassword: newPass });
      toast.success("Password changed!");
      setPasswordOpen(false);
    } catch {
      toast.error("Password update failed");
    } finally {
      setChangingPass(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await API.delete("/users/me");
      toast.success("Account deleted");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 2, background: theme.palette.background.default, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Profile Banner & Info */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ height: 140, background: 'linear-gradient(135deg,#42a5f5 0%,#1e88e5 100%)' }} />
            <Box sx={{ textAlign: 'center', mt: -6, px: 2, pb: 2 }}>
              <Avatar
                src={avatarPreview || defaultAvatar}
                alt={user.name}
                sx={{ width: 96, height: 96, border: '4px solid white', mx: 'auto' }}
              />
              <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{user.bio}</Typography>
              <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                email: {user.email}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ mb: 1 }}>
                Phone: {user.phoneNumber || '—'}
              </Typography>
              <Box display="flex" justifyContent="center" gap={4}>
                <Box>
                  <Typography fontWeight="bold">{user.following?.length}</Typography>
                  <Typography variant="caption">Following</Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">{user.followers?.length}</Typography>
                  <Typography variant="caption">Followers</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
                <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>Edit</Button>
                <Button startIcon={<LockOpen />} onClick={() => setPasswordOpen(true)}>Password</Button>
                <Button startIcon={<AddCircleOutline />} onClick={() => setAiOpen(true)}>Ask AI</Button>
                <Button color="error" startIcon={<DeleteForever />} onClick={() => setDeleteOpen(true)}>Delete</Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Tabs: Suggestions / Following / Followers */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
              <Tab label="Suggestions" />
              <Tab label="Following" />
              <Tab label="Followers" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
              <TextField
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
              />
            </Box>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {(tabIndex === 0 ? suggestions : tabIndex === 1 ? followingList : followersList)
                .map(u => (
                  <Grid key={u.id} item xs={12} sm={6} md={4}>
                    <FriendCard
                      user={u}
                      followingList={user.following}
                      onFollow={handleFollow}
                      onUnfollow={handleUnfollow}
                    />
                  </Grid>
                ))}
              {((tabIndex === 0 && suggestions.length === 0) || (tabIndex === 1 && followingList.length === 0) || (tabIndex === 2 && followersList.length === 0)) && (
                <Box sx={{ width: '100%', textAlign: 'center', p: 3 }}><Typography>No users found.</Typography></Box>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          Edit Profile
          <IconButton onClick={() => setEditOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" mb={2}>
            <Avatar src={avatarPreview} sx={{ width: 72, height: 72, mx: 'auto' }} />
            <Button component="label" sx={{ mt: 1 }}>Upload<input type="file" hidden accept="image/*" onChange={handleAvatarChange} /></Button>
            <TextField
              fullWidth
              margin="dense"
              label="Or Image URL"
              value={avatarUrlInput}
              onChange={e => { setAvatarUrlInput(e.target.value); setAvatarFile(null); setAvatarPreview(e.target.value); }}
            />
          </Box>
          <TextField fullWidth margin="dense" label="Name" value={editData.name} onChange={e=>setEditData({...editData,name:e.target.value})} />
          <TextField fullWidth margin="dense" label="Bio" multiline rows={2} value={editData.bio} onChange={e=>setEditData({...editData,bio:e.target.value})} />
          <TextField fullWidth margin="dense" label="Phone" value={editData.phoneNumber} onChange={e=>setEditData({...editData,phoneNumber:e.target.value})} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} disabled={uploading} variant="contained">{uploading? 'Saving...' : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onClose={() => setPasswordOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Current" type="password" fullWidth value={oldPass} onChange={e=>setOldPass(e.target.value)} />
          <TextField margin="dense" label="New" type="password" fullWidth value={newPass} onChange={e=>setNewPass(e.target.value)} />
          <TextField margin="dense" label="Confirm" type="password" fullWidth value={confirmPass} onChange={e=>setConfirmPass(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordOpen(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} disabled={changingPass} variant="contained">{changingPass? 'Updating...' : 'Update'}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>Are you sure? This action is irreversible.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} disabled={deleting} color="error" variant="contained">{deleting? 'Deleting...' : 'Delete'}</Button>
        </DialogActions>
      </Dialog>

      {/* AI ChatBot Dialog */}
      <ChatBot open={aiOpen} onClose={() => setAiOpen(false)} />
    </Box>
  );
};

export default ProfilePage;
