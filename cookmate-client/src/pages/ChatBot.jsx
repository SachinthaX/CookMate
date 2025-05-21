import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API from "../services/api";

function ChatBot({ open, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");
  const [lastResponse, setLastResponse] = useState("");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const handleSend = async () => {
    const text = prompt.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLastPrompt(text);
    setLoading(true);

    try {
      const res = await API.post("/users/chat", { prompt: text });
      const aiReply = res.data.response || "No response from AI.";
      setLastResponse(aiReply);
      setMessages((prev) => [...prev, { role: "assistant", content: aiReply }]);
      setPrompt("");
    } catch (err) {
      console.error("Error chatting with AI:", err, err.response?.data);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChat = async () => {
    try {
      await API.post(
        "/chats",
        {
          userId,
          prompt: lastPrompt,
          aiResponse: lastResponse,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Failed to save chat:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Ask the Cooking Assistant 👨‍🍳🔥
        <IconButton
          size="small"
          sx={{ position: "absolute", right: 8, top: 8 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: "#fffaf0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "60vh",
          overflowY: "auto",
          pb: 2,
        }}
      >
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#dcf8c6" : "#f1f0f0",
              p: 1.5,
              borderRadius: 2,
              maxWidth: "80%",
              boxShadow: 1,
              whiteSpace: "pre-wrap",
            }}
          >
            <Typography variant="body2" fontWeight="bold">
              {msg.role === "user" ? "You" : "ChefBot"} 🍳
            </Typography>
            <Typography variant="body1">{msg.content}</Typography>
          </Box>
        ))}
      </DialogContent>

      <Box px={3} pb={2}>
        <TextField
          fullWidth
          placeholder="Type your cooking question..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          multiline
          rows={2}
        />

        <Box mt={1} display="flex" gap={1}>
          <Button
            variant="outlined"
            onClick={() => (window.location.href = "/chat-history")}
          >
            View Saved Chats
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Send"}
          </Button>
        </Box>

        {lastPrompt && lastResponse && (
          <Button
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            onClick={handleSaveChat}
          >
            Save This Chat
          </Button>
        )}
      </Box>

      <DialogActions>
        <Button onClick={onClose} color="error">
          Close
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Chat saved to history!"
      />
    </Dialog>
  );
}

export default ChatBot;
