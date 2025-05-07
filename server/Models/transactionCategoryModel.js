import mongoose from "mongoose";

const transactionCategorySchema = mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },

  categoryName: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
});

const transactionCategory = mongoose.model("transactionCategory", transactionCategorySchema);
export default transactionCategory;
