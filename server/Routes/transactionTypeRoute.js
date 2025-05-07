import { Router } from "express";
import transactionTypeController from "../Controllers/transactionTypeController.js";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

router.get("/get", checkAuth, transactionTypeController.getAllTypes);

router.get("/getByType", checkAuth, transactionTypeController.getByType);

router.post("/create", checkAuth, transactionTypeController.createType);

router.delete("/delete/:id", checkAuth, transactionTypeController.deleteType);

export default router;
