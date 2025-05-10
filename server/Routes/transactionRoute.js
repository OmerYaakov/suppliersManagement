import Router from "express";
import transactionController from "../Controllers/transactionController.js";
import multer from "multer";
import path from "path";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     return cb(null, path.resolve(process.cwd(), "./public/uploads"));
//   },
//   filename: (req, file, cb) => {
//     return cb(null, file.originalname);
//   },
// });

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max per file
});

router.get("/get", checkAuth, transactionController.getAllTransactions);

router.get("/getBySupplier", checkAuth, transactionController.getBySupplier);

router.get("/get/:_id", checkAuth, transactionController.getById);

router.get("/get/date/:date", checkAuth, transactionController.getByDate);

//update transaction number
router.patch(
  "/updateTransactionNumber/:_id",
  checkAuth,
  transactionController.updateTransactionNumber
);

router.post(
  "/create",
  checkAuth,
  upload.array("file", 10),
  transactionController.createTransaction
);

router.get("/exportTransactions", checkAuth, transactionController.exportTransactionsToExcel);

export default router;
