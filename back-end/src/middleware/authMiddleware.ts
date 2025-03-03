import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import validateEnv from "../util/validateEnv";

export const protect: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw createHttpError(401, "Not authorized, no token");
    }

    const decoded = jwt.verify(token, validateEnv.JWT_SECRET) as { id: string };

    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      throw createHttpError(401, "User not found");
    }

    req.userId = user._id.toString(); // Attach user to request object
    next();
  } catch (error) {
    next(createHttpError(401, "Invalid token", { cause: error }));
  }
};
