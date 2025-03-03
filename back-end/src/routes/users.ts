// import express from "express";
// import * as userController from "../controllers/user";
// import { requiresAuth } from "../middleware/auth";
// // import { requiresAuth } from "../middleware/auth";

// const router = express.Router();

// router.get("/",requiresAuth, userController.getAuthenticatedUser);

// router.post("/signup", userController.signUp);

// router.post("/login", userController.login);

// router.post("/logout", userController.logout);

// export default router;

import express from "express";
import {
  getAuthenticatedUser,
  login,
  logout,
  signUp,
} from "../controllers/user";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", protect, getAuthenticatedUser);

export default router;
