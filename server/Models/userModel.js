import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensure that the email is unique in the database
  },
  googleId: {
    type: String, // Google ID (sub) to uniquely identify users who sign in via Google
    required: true,
    unique: true,
  },
});

export default mongoose.model("User", userSchema);
