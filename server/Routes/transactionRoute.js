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
const upload = multer({ storage });

router.get("/get", checkAuth, transactionController.getAllTransactions);

router.get("/getBySupplier", checkAuth, transactionController.getBySupplier);

router.get("/get/:_id", checkAuth, transactionController.getById);

router.get("get/:date", checkAuth, transactionController.getByDate);

router.post(
  "/create",
  upload.array("file", 10),
  checkAuth,
  transactionController.createTransaction
);

export default router;
