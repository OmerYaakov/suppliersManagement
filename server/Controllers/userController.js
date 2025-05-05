import jwt from "jsonwebtoken";
import axios from "axios";
import User from "../Models/userModel.js";
import dotenv from "dotenv";
dotenv.config();

const loginWithGoogle = async (req, res) => {
  const token = req.body.credential || req.body.token;

  try {
    // Verify the Google token using Google API
    const googleResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );

    const { sub, email } = googleResponse.data; // `sub` is the Google ID, and `email` is the user's email.

    // Check if the user exists in your database
    let user = await User.findOne({ email });

    // If the user does not exist, create a new one
    if (!user) {
      user = new User({
        email,
        googleId: sub, // Google ID
        password: "", // No password for Google login
      });

      await user.save();
    }

    // Generate your own JWT token for app authentication
    const appToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    // Return the token and user data
    res.status(200).json({
      token: appToken, // JWT for your app
      userData: {
        email: user.email,
        userId: user._id,
      },
    });
  } catch (err) {
    console.error("Error logging in with Google:", err);
    res.status(500).json({ message: "Error logging in with Google." });
  }
};

export default { loginWithGoogle };
