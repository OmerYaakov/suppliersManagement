import Router from "express";
import transactionController from "../Controllers/transactionController.js";

const router = new Router();

router.get("/get", transactionController.getAllTransactions);

router.get("/getBySupplier", transactionController.getBySupplier);

router.get("/get/:_id", transactionController.getById);

router.get("get/:date", transactionController.getByDate);

router.post("/create", transactionController.createTransaction);

export default router;
