import { Router } from "express";
import transactionTypeController from "../Controllers/transactionTypeController.js";

const router = new Router();

router.get("/get", transactionTypeController.getAllTypes);

router.get("/getByType", transactionTypeController.getByType);

router.post("/create", transactionTypeController.createType);

router.delete("/delete/:id", transactionTypeController.deleteType);

export default router;
