import { errorMessages } from "vue/compiler-sfc";
import trasactionModel from "../Models/transactionModel.js";

const createTransaction = async (req, res) => {
  console.log("creating transaction...");
  const {
    supplierName,
    transactionType,
    transactionNumber,
    transactionAmount,
    transactionDate,
    receivesTransaction,
    transactionCategory,
    notes,
  } = req.body;
  try {
    const exsitingTransaction = await trasactionModel.findOne({
      transactionNumber: transactionNumber,
    });
    if (exsitingTransaction) {
      return res.status(409).json({ message: "transaction with this number is already exists" });
    }

    const newTransaction = await trasactionModel.create({
      supplierName,
      transactionType,
      transactionNumber,
      transactionAmount,
      transactionDate,
      receivesTransaction,
      transactionCategory,
      notes,
    });

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction: ", error.message);
    res.status(500).json({ message: error.message });
  }
};

const getAllTransactions = async (req, res) => {};
const getBySupplier = async (req, res) => {};
const getById = async (req, res) => {};
const getByDate = async (req, res) => {};

export default { createTransaction, getAllTransactions, getBySupplier, getById, getByDate };
