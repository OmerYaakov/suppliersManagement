import transactionModel from "../Models/transactionModel.js";

const createTransaction = async (req, res) => {
  console.log("Creating transaction...");

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
    const existingTransaction = await transactionModel.findOne({
      transactionNumber,
      supplierName,
    });

    if (existingTransaction) {
      return res.status(409).json({
        message: "Transaction with this number already exists.",
      });
    }

    // Validate number of uploaded files
    if (req.files.length > 10) {
      return res.status(400).json({
        message: "You can attach up to 10 images only.",
      });
    }

    // Map file data only if files exist
    const files = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          url: `/public/uploads/${file.originalname}`,
          size: file.size,
        }))
      : [];

    const newTransaction = await transactionModel.create({
      supplierName,
      transactionType,
      transactionNumber,
      transactionAmount,
      transactionDate,
      receivesTransaction,
      transactionCategory,
      notes,
      files,
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

    const transacions = await transactionModel
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
    const transactions = await transactionModel.find();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getById = async (req, res) => {};

const getByDate = async (req, res) => {};

export default { createTransaction, getAllTransactions, getBySupplier, getById, getByDate };
