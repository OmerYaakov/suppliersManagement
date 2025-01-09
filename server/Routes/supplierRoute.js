import Router from "express";
import SupplierController from "../Controllers/supplierController.js";
import supplierController from "../Controllers/supplierController.js";

const router = new Router();

router.get("/get", SupplierController.getAllSuppliers);

router.get("/get/:id", SupplierController.getById);

router.post("/create", SupplierController.createSupplier);

router.post("/updateAmount", SupplierController.updateSupplierAmount);

router.get("/getSupplierAmount", supplierController.getSumAmount);

export default router;
