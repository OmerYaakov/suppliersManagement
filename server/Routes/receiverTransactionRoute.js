import { Router } from "express";
import receiverTransactionController from "../Controllers/receiverTransacionController.js";

const router = new Router();

router.get("/get", receiverTransactionController.getAllReceivers);

router.get("/getByName", receiverTransactionController.getByName);

router.post("/create", receiverTransactionController.createReceiver);

router.delete("/delete/:id", receiverTransactionController.deleteReceiver);

export default router;
