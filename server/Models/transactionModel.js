import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  supplierName: {
    type: String,
    required: true,
  },

  transactionType: {
    type: String,
    required: true,
  },

  transactionNumber: {
    type: Number,
    required: true,
  },

  transactionAmount: {
    type: Number,
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  recivesTransaction: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  notes: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
