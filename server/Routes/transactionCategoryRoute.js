import { Router } from "express";
import transactionCategoryController from "../Controllers/transactionCategoryController.js";

const router = new Router();

router.get("/get", transactionCategoryController.getAllCategory);

router.get("/getByCategory", transactionCategoryController.getByCategory);

router.post("/create", transactionCategoryController.createCategory);

router.delete("/delete", transactionCategoryController.deleteCategory);

export default router;
