import express from "express";
import {
  getAuthenticatedUser,
  login,
  logout,
  signUp,
  updateUserInformation,
  getAllUser,
} from "../controllers/user";
import { protect } from "../middleware/authMiddleware";
import profileupload from "../middleware/singleupload";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", protect, getAuthenticatedUser);
router.get("/all", getAllUser);

router.put("/update/:userId", protect, profileupload, updateUserInformation);

export default router;
