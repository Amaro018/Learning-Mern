import express from "express";
import * as userController from "../controllers/user";

const router = express.Router();

router.get("/", userController.getAuthenticatedUser);

router.post("/signup", userController.signUp);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

export default router;