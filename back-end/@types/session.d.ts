// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from "express";
import mongoose from "mongoose";

// Define User Type
export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
}

// Extend Express Request to Include `user`
