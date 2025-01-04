import mongoose from "mongoose";

const transactionTypeSchema = mongoose.Schema({
  typeName: {
    type: String,
    require: true,
    unique: true,
    trim: true,
  },
});

const transactionType = mongoose.model("transactionType", transactionTypeSchema);
export default transactionType;
