import transactionModel from "../Models/transactionModel.js";
import AWS from "aws-sdk";
import path from "path";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// const createTransaction = async (req, res) => {
//   console.log("Creating transaction...");

//   const {
//     supplierName,
//     transactionType,
//     transactionNumber,
//     transactionAmount,
//     transactionDate,
//     receivesTransaction,
//     transactionCategory,
//     notes,
//   } = req.body;

//   try {
//     const userId = req.user.userId;

//     const existingTransaction = await transactionModel.findOne({
//       createdBy: userId,
//       transactionNumber,
//       supplierName,
//     });

//     if (existingTransaction) {
//       return res.status(409).json({
//         message: "Transaction with this number already exists.",
//       });
//     }

//     if (req.files.length > 10) {
//       return res.status(400).json({ message: "You can attach up to 10 images only." });
//     }

//     const uploadPromises = req.files.map((file) => {
//       const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: `${Date.now()}-${file.originalname}`,
//         Body: file.buffer,
//         ContentType: file.mimetype,
//       };

//       return s3.upload(params).promise();
//     });

//     const uploadedFiles = await Promise.all(uploadPromises);

//     const files = uploadedFiles.map((file) => ({
//       name: file.Key,
//       url: file.Location,
//       size: file.ContentLength || 0,
//     }));

//     const newTransaction = await transactionModel.create({
//       supplierName,
//       transactionType,
//       transactionNumber,
//       transactionAmount,
//       transactionDate,
//       receivesTransaction,
//       transactionCategory,
//       notes,
//       files,
//       createdBy: userId,
//     });

//     res.status(201).json(newTransaction);
//   } catch (error) {
//     console.error("Error creating transaction: ", error.message);
//     res.status(500).json({ message: error.message });
//   }
// };

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
    const userId = req.user.userId;

    const existingTransaction = await transactionModel.findOne({
      createdBy: userId,
      transactionNumber,
      supplierName,
    });

    if (existingTransaction) {
      return res.status(409).json({
        message: "Transaction with this number already exists.",
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({ message: "You can attach up to 10 images only." });
    }

    // ✅ Validate image extensions
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    for (let file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!validExtensions.includes(ext)) {
        return res.status(400).json({ message: `Unsupported file type: ${ext}` });
      }
    }

    // ✅ Upload files to S3
    const uploadPromises = req.files.map((file) => {
      const safeFilename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: safeFilename,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      return s3.upload(params).promise();
    });

    const uploadedFiles = await Promise.all(uploadPromises);

    const files = uploadedFiles.map((file) => ({
      name: file.Key,
      url: file.Location,
      size: file.ContentLength || 0,
    }));

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
      createdBy: userId,
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
    const userId = req.user.userId; // Get userId from the decoded token
    const { supplierName } = req.query;

    const transacions = await transactionModel
      .find({
        createdBy: userId, // Ensure the user is authenticated
        supplierName: supplierName,
      })
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
