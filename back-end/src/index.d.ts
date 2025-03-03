import { Request } from "express";
import mongoose from "mongoose";
import { UserDocument } from "../models/users"; // Adjust the path based on your project structure

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDocument; // This ensures req.user exists
  }
}
