import mongoose from "mongoose";

const transactionCategorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
});

const transactionCategory = mongoose.model("transactionCategory", transactionCategorySchema);
export default transactionCategory;
