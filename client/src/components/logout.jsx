import { Google } from "@mui/icons-material";
import { googleLogout } from "@react-oauth/google"; // Correct import

import React from "react";

function Logout() {
  const onSuccess = () => {
    console.log("Logout made successfully");
    localStorage.removeItem("profile");
    localStorage.removeItem("token"); // Remove the token from localStorage
    window.location.href = "/login"; // Redirect to login after successful logout
  };

  const onFailure = () => {
    console.log("Logout failed");
  };

  const handleLogout = () => {
    googleLogout(); // Calls googleLogout function to log out the user
    onSuccess(); // Executes onSuccess after logging out
  };

  return (
    <div id="signOutButton">
      <button onClick={handleLogout} className="btn btn-warning">
        <Google /> התנתקות
      </button>
    </div>
  );
}

export default Logout;
