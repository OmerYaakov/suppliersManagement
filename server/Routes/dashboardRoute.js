import { Router } from "express";
import checkAuth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import dashboardController from "../Controllers/dashboardController.js";

const router = Router();
router.get("/stats", checkAuth, isAdmin, dashboardController.getStats);

export default router;
