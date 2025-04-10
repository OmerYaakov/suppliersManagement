import React from "react";
import { Box, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode"; // Correct import

const Login = () => {
  const navigate = useNavigate();

  const onSuccess = (res) => {
    const user = res;
    console.log("Login Success: currentUser:", user);

    // Decode the JWT token to get user information
    const decodedToken = jwt_decode(user.credential);
    console.log("Decoded Token:", decodedToken);

    const profile = {
      token: user, // The token (JWT) returned by Google
    };

    // Store profile information in localStorage
    localStorage.setItem("profile", JSON.stringify(profile));

    localStorage.setItem("token", user.credential); // Store the token

    navigate("/");
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Box sx={{ mt: 2 }}>
          <GoogleLogin
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
