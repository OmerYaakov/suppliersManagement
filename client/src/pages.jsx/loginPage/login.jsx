import React, { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", { email, password });
      if (response.data.success) {
        navigate("/");
      } else {
        alert(response.data.message); // display message if login fails
      }
    } catch (error) {
      alert("Error during login");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          התחברות
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="אימייל"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="סיסמא"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <Button type="submit" fullWidth variant="contained" color="primary">
            להתחבר
          </Button>
        </form>

        {/* "Forgot Password?" link */}
        <Box sx={{ mt: 2 }}>
          <Typography
            variant="body2"
            color="primary"
            onClick={() => navigate("/forgot-password")}
            sx={{ cursor: "pointer", textAlign: "center" }}>
            שכחתי סיסמא
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
