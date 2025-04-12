import React from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; // Correct import
import axios from "axios"; // For sending requests to your backend

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = async (res) => {
    const user = res;
    console.log("Login Success: currentUser:", user);

    // Decode the JWT token to get user information
    const decodedToken = jwt_decode(user.credential);
    console.log("Decoded Token:", decodedToken);

    // Send the token to your backend to validate it and get the app JWT token
    try {
      const response = await axios.post("/user/login", {
        token: user.credential, // Send the Google token to your backend
      });

      // On successful login, the backend will return the app's JWT token and user data
      const { token, userData } = response.data;

      // Store the JWT token and user profile information in localStorage
      localStorage.setItem("profile", JSON.stringify(userData)); // Store user profile
      localStorage.setItem("token", token); // Store JWT token for your app

      // Redirect to the home page or any other page after successful login
      navigate("/"); // Redirect to the homepage
    } catch (err) {
      console.log("Error during login with backend:", err);
    }
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Box sx={{ mt: 2 }}>
          <GoogleLogin
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID} // Your Google client ID
            buttonText="Login with Google"
            onSuccess={onSuccess} // Callback for successful login
            onFailure={onFailure} // Callback for login failure
            cookiePolicy={"single_host_origin"}
            isSignedIn={true} // Automatically sign the user in
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
