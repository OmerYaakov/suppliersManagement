import trasactionModel from "../Models/transactionModel.js";

const createTransaction = async (req, res) => {
  console.log("creating transaction...");

  const supplierName = req.body.supplierName;
  const transactionType = req.body.transactionType;
  const transactionNumber = req.body.transactionNumber;
  const transactionAmount = req.body.transactionAmount;
  const transactionDate = req.body.transactionDate;
  const receivesTransaction = req.body.receivesTransaction;
  const transactionCategory = req.body.transactionCategory;
  const notes = req.body.notes;
  const files = [];

  try {
    const exsitingTransaction = await trasactionModel.findOne({
      transactionNumber: transactionNumber,
      supplierName: supplierName,
    });
    if (exsitingTransaction) {
      return res.status(409).json({ message: "transaction with this number is already exists" });
    }

    req.files.forEach((file) => {
      files.push(`/uploads/${file.originalname}`);
    });

    const newTransaction = await trasactionModel.create({
      supplierName: supplierName,
      transactionType: transactionType,
      transactionNumber: transactionNumber,
      transactionAmount: transactionAmount,
      transactionDate: transactionDate,
      receivesTransaction: receivesTransaction,
      transactionCategory: transactionCategory,
      notes: notes,
      files: files,
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

    const transacions = await trasactionModel
      .find({ supplierName: supplierName })
      .sort({ transactionDate: -1 }); //// 1 for ascending, -1 for descending

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
