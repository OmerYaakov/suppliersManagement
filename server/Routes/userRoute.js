import { Router } from "express";
import userController from "../Controllers/userController.js";

const router = new Router();

router.get("/", (req, res) => {
  res.status(404).send("404 Page Not Found");
});

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.get("/get", userController.getUser);

export default router;
