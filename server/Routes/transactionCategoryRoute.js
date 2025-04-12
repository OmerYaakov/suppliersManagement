import { Router } from "express";
import transactionCategoryController from "../Controllers/transactionCategoryController.js";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

router.get("/get", checkAuth, transactionCategoryController.getAllCategory);

router.get("/getByCategory", checkAuth, transactionCategoryController.getByCategory);

router.post("/create", checkAuth, transactionCategoryController.createCategory);

router.delete("/delete/:id", checkAuth, transactionCategoryController.deleteCategory);

export default router;
