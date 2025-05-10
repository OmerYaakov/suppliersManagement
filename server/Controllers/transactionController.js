import transactionModel from "../Models/transactionModel.js";
import AWS from "aws-sdk";
import path from "path";
import heicConvert from "heic-convert";
import ExcelJS from "exceljs";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

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
    let existingTransaction = false;
    const userId = req.user.userId;
    // Check if the user is authenticated
    if (!(Number(transactionNumber) === 0 && transactionType === "קבלה")) {
      existingTransaction = await transactionModel.findOne({
        createdBy: userId,
        transactionNumber,
        transactionType,
        supplierName,
      });
    }

    if (existingTransaction) {
      return res.status(409).json({
        message: "Transaction with this number already exists.",
      });
    }

    if (req.files.length > 10) {
      return res.status(400).json({ message: "You can attach up to 10 images only." });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/heic"];
    for (let file of req.files) {
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({ message: `Unsupported file type: ${file.mimetype}` });
      }
    }

    // ✅ Validate image extensions
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".heic"];
    for (let file of req.files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!validExtensions.includes(ext)) {
        return res.status(400).json({ message: `Unsupported file type: ${ext}` });
      }
    }

    const uploadPromises = req.files.map(async (file) => {
      let buffer = file.buffer;
      let extension = path.extname(file.originalname).toLowerCase();
      let contentType = file.mimetype;
      let safeFilename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

      if (file.mimetype === "image/heic" || extension === ".heic") {
        console.log("Converting HEIC image...");
        buffer = await heicConvert({
          buffer: file.buffer,
          format: "JPEG",
          quality: 1,
        });
        extension = ".jpg";
        contentType = "image/jpeg";
        safeFilename = safeFilename.replace(/\.heic/i, ".jpg");
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: safeFilename,
        Body: buffer,
        ContentType: contentType,
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

const updateTransactionNumber = async (req, res) => {
  const { _id } = req.params;
  const { newTransactionNumber } = req.body;

  try {
    // Check if another transaction already has this number
    const existing = await transactionModel.findOne({
      transactionNumber: newTransactionNumber,
      _id: { $ne: _id }, // exclude the current transaction
    });

    if (existing) {
      return res.status(409).json({ message: "מספר עסקה כבר קיים" });
    }

    const updated = await transactionModel.findByIdAndUpdate(
      _id,
      { transactionNumber: newTransactionNumber },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.error("Update failed", error.message);
    res.status(500).json({ message: "שגיאה בעדכון מספר העסקה" });
  }
};

const exportTransactionsToExcel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { supplierName } = req.query;

    const query = { createdBy: userId };
    if (supplierName) {
      query.supplierName = supplierName;
    }

    const transactions = await transactionModel.find(query).sort({ transactionDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "מספר עסקה", key: "transactionNumber", width: 15 },
      { header: "שם ספק", key: "supplierName", width: 25 },
      { header: "סוג עסקה", key: "transactionType", width: 15 },
      { header: "תאריך", key: "transactionDate", width: 20 },
      { header: "סכום", key: "transactionAmount", width: 15 },
      { header: "מקבל עסקה", key: "receivesTransaction", width: 25 },
      { header: "קטגוריה", key: "transactionCategory", width: 20 },
      { header: "הערות", key: "notes", width: 30 },
    ];

    transactions.forEach((t) => {
      worksheet.addRow({
        transactionNumber: t.transactionNumber,
        supplierName: t.supplierName,
        transactionType: t.transactionType,
        transactionDate: t.transactionDate,
        transactionAmount: t.transactionAmount,
        receivesTransaction: t.receivesTransaction,
        transactionCategory: t.transactionCategory,
        notes: t.notes,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const encodedFileName = encodeURIComponent(`transactions_${supplierName || "all"}.xlsx`);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: "שגיאה בייצוא לאקסל" });
  }
};

const getById = async (req, res) => {};

const getByDate = async (req, res) => {};

export default {
  createTransaction,
  getAllTransactions,
  getBySupplier,
  getById,
  getByDate,
  updateTransactionNumber,
  exportTransactionsToExcel,
};
