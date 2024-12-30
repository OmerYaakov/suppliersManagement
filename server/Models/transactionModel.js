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

  transactionDate: {
    type: String,
    required: true,
  },

  receivesTransaction: {
    type: String,
    required: true,
  },

  transactionCategory: {
    type: String,
    required: true,
  },

  notes: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
