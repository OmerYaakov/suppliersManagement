import Router from "express";
import SupplierController from "../Controllers/supplierController.js";
import supplierController from "../Controllers/supplierController.js";

const router = new Router();

router.get("/get", SupplierController.getAllSuppliers);

router.get("/get/:_id", SupplierController.getById);

router.post("/create", SupplierController.createSupplier);

//router.put("/update", SupplierController.updateSupplier);

router.patch("/update/:id", supplierController.updateSupplier);

export default router;
