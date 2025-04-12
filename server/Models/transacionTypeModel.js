import mongoose from "mongoose";

const transactionTypeSchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  typeName: {
    type: String,
    required: true,
    trim: true,
  },
});

// Enforcing uniqueness of `typeName` per user
transactionTypeSchema.index({ createdBy: 1, typeName: 1 }, { unique: true });

const transactionType = mongoose.model("transactionType", transactionTypeSchema);
export default transactionType;
