import Router from "express";
import transactionController from "../Controllers/transactionController.js";
import multer from "multer";
import path from "path";

const router = new Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    return cb(null, path.resolve(process.cwd(), "./public/uploads"));
  },
  filename: (req, file, cb) => {
    return cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/get", transactionController.getAllTransactions);

router.get("/getBySupplier", transactionController.getBySupplier);

router.get("/get/:_id", transactionController.getById);

router.get("get/:date", transactionController.getByDate);

router.post("/create", upload.array("file", 10), transactionController.createTransaction);

export default router;
