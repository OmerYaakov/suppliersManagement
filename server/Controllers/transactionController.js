import transactionModel from "../Models/transactionModel.js";
import AWS from "aws-sdk";
import path from "path";
import heicConvert from "heic-convert";
import ExcelJS from "exceljs";
import supplierModel from "../Models/supplierModel.js";

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

    const uploadWithTimeout = (params) => {
      return Promise.race([
        s3.upload(params).promise(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("S3 upload timeout")), 10000)),
      ]);
    };
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

      const bucketName = process.env.AWS_BUCKET_NAME;
      if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is missing in environment variables.");
      }
      const params = {
        Bucket: bucketName,
        Key: safeFilename,
        Body: buffer,
        ContentType: contentType,
      };

      return uploadWithTimeout(params);
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

export const updateTransactionFiles = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { remainingFiles } = req.body; // Array of file names to keep

    const transaction = await transactionModel.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // 1. Remove unwanted files from S3
    const filesToDelete = transaction.files.filter((f) => !remainingFiles.includes(f.name));

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: filesToDelete.map((file) => ({ Key: file.name })),
        Quiet: true,
      },
    };

    if (deleteParams.Delete.Objects.length > 0) {
      await s3.deleteObjects(deleteParams).promise();
    }

    // 2. Upload new files (if any)
    const uploadPromises = (req.files || []).map(async (file) => {
      let buffer = file.buffer;
      let extension = path.extname(file.originalname).toLowerCase();
      let contentType = file.mimetype;
      let safeFilename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

      if (file.mimetype === "image/heic" || extension === ".heic") {
        buffer = await heicConvert({
          buffer: file.buffer,
          format: "JPEG",
          quality: 1,
        });
        extension = ".jpg";
        contentType = "image/jpeg";
        safeFilename = safeFilename.replace(/\.heic/i, ".jpg");
      }

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: safeFilename,
        Body: buffer,
        ContentType: contentType,
      };

      const uploaded = await s3.upload(uploadParams).promise();
      return {
        name: uploaded.Key,
        url: uploaded.Location,
        size: uploaded.ContentLength || 0,
      };
    });

    const newFiles = await Promise.all(uploadPromises);

    // 3. Update the transaction document
    const updatedTransaction = await transactionModel.findByIdAndUpdate(
      transactionId,
      {
        files: [...transaction.files.filter((f) => remainingFiles.includes(f.name)), ...newFiles],
      },
      { new: true }
    );

    res.status(200).json(updatedTransaction);
  } catch (err) {
    console.error("❌ updateTransactionFiles:", err.message);
    res.status(500).json({ message: "Failed to update files" });
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

const exportSupplierTransactionsToExcel = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { supplierName } = req.query;

    const query = { createdBy: userId };
    if (supplierName) {
      query.supplierName = supplierName;
    }
    const supplier = await supplierModel.findOne({ createdBy: userId, supplierName }, "sumAmount");
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const transactions = await transactionModel.find(query).sort({ transactionDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");
    worksheet.columns = [
      { header: "שם ספק", key: "supplierName", width: 25 },
      { header: "תאריך", key: "transactionDate", width: 20 },
      { header: "סוג עסקה", key: "transactionType", width: 15 },
      { header: "מספר עסקה", key: "transactionNumber", width: 15 },
      { header: "סכום", key: "transactionAmount", width: 20 },
    ];

    // worksheet.addRow({
    //   supplierName: "שם ספק",
    //   transactionDate: "תאריך",
    //   transactionType: "סוג עסקה",
    //   transactionNumber: "מספר עסקה",
    //   transactionAmount: "סכום",
    // });

    const headerRow = worksheet.lastRow;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });
    transactions.forEach((t) => {
      worksheet.addRow({
        supplierName: t.supplierName,
        transactionDate: t.transactionDate,
        transactionType: t.transactionType,
        transactionNumber: t.transactionNumber,
        transactionAmount: t.transactionAmount,
      });
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell, colNumber) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        if (colNumber === 5) {
          cell.numFmt = '"₪"#,##0.00';
        }
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

const exportAllTransactionsToExcel = async (req, res) => {
  try {
    const userId = req.user.userId; // Get userId from the decoded token
    const transactions = await transactionModel
      .find({ createdBy: userId }) // Ensure the user is authenticated
      .sort({ supplierName: -1, transactionDate: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("All Transactions");

    worksheet.columns = [
      { header: "שם ספק", key: "supplierName", width: 25 },
      { header: "תאריך", key: "transactionDate", width: 20 },
      { header: "סוג עסקה", key: "transactionType", width: 15 },
      { header: "מספר עסקה", key: "transactionNumber", width: 15 },
      { header: "סכום", key: "transactionAmount", width: 15 },
    ];

    transactions.forEach((t) => {
      worksheet.addRow({
        supplierName: t.supplierName,
        transactionDate: t.transactionDate,
        transactionType: t.transactionType,
        transactionNumber: t.transactionNumber,
        transactionAmount: t.transactionAmount,
      });
      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
          cell.alignment = { vertical: "middle", horizontal: "center" };
        });
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    const encodedFileName = encodeURIComponent(`all_transactions.xlsx`);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedFileName}`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel export error:", error);
    res.status(500).json({ message: "שגיאה בייצוא לאקסל" });
  }
};

export const getByTransactionNumber = async (req, res) => {
  try {
    const transactionNumber = req.params.transactionNumber;
    const userId = req.user.userId;

    const transaction = await transactionModel.findOne({
      transactionNumber,
      createdBy: userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("❌ getByTransactionNumber error:", error);
    res.status(500).json({ message: "Failed to fetch transaction" });
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
  exportSupplierTransactionsToExcel,
  exportAllTransactionsToExcel,
  updateTransactionFiles,
  getByTransactionNumber,
};
