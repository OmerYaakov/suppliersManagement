import { Router } from "express";
import userController from "../Controllers/userController.js";

const router = new Router();

router.post("/login", userController.loginWithGoogle);

export default router;
