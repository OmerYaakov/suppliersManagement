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
      supplierName: supplierName,
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

const getBySupplier = async (req, res) => {
  try {
    console.log("getting by supplier...");
    const { supplierName } = req.query;

    const transacions = await trasactionModel.find({ supplierName: supplierName });

    if (transacions.lengh === 0) {
      return res.status(404).message({ message: "there is no transaction with this supplier" });
    }

    res.status(200).json(transacions);
    console.log(supplierName);
  } catch (error) {
    console.error(`there is an error:`, error.message);
  }
};

const getAllTransactions = async (req, res) => {
  try {
    console.log("getting all transaction... ");
    const transactions = await trasactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getById = async (req, res) => {};

const getByDate = async (req, res) => {};

export default { createTransaction, getAllTransactions, getBySupplier, getById, getByDate };
