import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import validateEnv from "../util/validateEnv";

export const protect: RequestHandler = async (req, res, next) => {
  try {
    console.log("🔍 Incoming Cookies:", req.cookies);
    console.log("🔍 Incoming Headers:", req.headers);

    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ No token found in cookies or headers");
      throw createHttpError(401, "Not authorized, no token");
    }

    console.log("✅ Token Found:", token);

    const decoded = jwt.verify(token, validateEnv.JWT_SECRET) as { id: string };
    console.log("✅ Decoded Token:", decoded);

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      console.log("❌ User not found in DB");
      throw createHttpError(401, "User not found");
    }

    console.log("✅ User Authenticated:", user.username);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error);
    next(createHttpError(401, "Invalid token", { cause: error }));
  }
};
