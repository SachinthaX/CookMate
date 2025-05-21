import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const ChatHistory = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [editedPrompt, setEditedPrompt] = useState("");

  const navigate = useNavigate();

  // Get userId and authInitialized from context, token from localStorage
  const { userId, authInitialized } = useAuth();
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Wait for AuthContext to initialize
    if (!authInitialized) return;

    if (!userId || !token) {
      console.error(
        `Cannot fetch chat history: ${!userId ? "userId" : ""}${!userId && !token ? " and " : ""}${!token ? "token" : ""} is null. Skipping fetch and redirecting to login.`
      );
      setLoading(false);
      navigate("/login");
      return;
    }

    fetchChats();
    // eslint-disable-next-line
  }, [userId, token, authInitialized, navigate]);

  const fetchChats = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/chats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchChats();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleEditClick = (chat) => {
    setSelectedChat(chat);
    setEditedPrompt(chat.prompt);
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    try {
      await axios.put(
        `http://localhost:8080/api/chats/${selectedChat.id}`,
        editedPrompt,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setEditDialogOpen(false);
      fetchChats();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>Loading chat history...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        🧠 AI Recipe Chat History
      </Typography>

      {chats.length === 0 ? (
        <Typography mt={4} align="center">
          No chat history found.
        </Typography>
      ) : (
        chats.map((chat) => (
          <Paper key={chat.id} sx={{ p: 2, my: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {new Date(chat.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body1" mt={1}>
              <strong>You:</strong> {chat.prompt}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              <strong>AI:</strong> {chat.aiResponse}
            </Typography>
            <Box mt={1}>
              <IconButton onClick={() => handleEditClick(chat)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => handleDelete(chat.id)}>
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Prompt</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatHistory;