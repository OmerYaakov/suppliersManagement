import { Router } from "express";
import receiverTransactionController from "../Controllers/receiverTransacionController.js";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

router.get("/get", checkAuth, receiverTransactionController.getAllReceivers);

router.get("/getByName", checkAuth, receiverTransactionController.getByName);

router.post("/create", checkAuth, receiverTransactionController.createReceiver);

router.delete("/delete/:id", checkAuth, receiverTransactionController.deleteReceiver);

export default router;
