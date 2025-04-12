import Router from "express";
import SupplierController from "../Controllers/supplierController.js";
import checkAuth from "../middlewares/auth.js";

const router = new Router();

router.get("/get", checkAuth, SupplierController.getAllSuppliers);

router.get("/get/:id", checkAuth, SupplierController.getById);

router.post("/create", checkAuth, SupplierController.createSupplier);

router.post("/updateAmount", checkAuth, SupplierController.updateSupplierAmount);

router.get("/getSupplierAmount", checkAuth, SupplierController.getSumAmount);

export default router;
