import Router from "express";
import transactionController from "../Controllers/transactionController.js";
import multer from "multer";
import path from "path";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

// Using memoryStorage for buffer-based upload (good for AWS S3, etc.)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
});

// GET routes
router.get("/get", checkAuth, transactionController.getAllTransactions);
router.get("/getBySupplier", checkAuth, transactionController.getBySupplier);
router.get("/get/:_id", checkAuth, transactionController.getById);
router.get("/get/date/:date", checkAuth, transactionController.getByDate);

// PATCH: Update transaction number
router.patch(
  "/updateTransactionNumber/:_id",
  checkAuth,
  transactionController.updateTransactionNumber
);

router.post("/create", checkAuth, upload.any, transactionController.createTransaction);

router.get(
  "/exportSupplierTransactions",
  checkAuth,
  transactionController.exportSupplierTransactionsToExcel
  upload.any(), // ✅ Accepts any files under any field name
  transactionController.createTransaction
);

router.get("/exportAllTransactions", checkAuth, transactionController.exportAllTransactionsToExcel);

router.get(
  "/exportSupplierTransactions",
  checkAuth,
  transactionController.exportSupplierTransactionsToExcel
);

router.get("/exportAllTransactions", checkAuth, transactionController.exportAllTransactionsToExcel);

export default router;
