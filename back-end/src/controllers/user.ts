import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateEnv from "../util/validateEnv";

// export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
//   // const authenticatedUserId = req.session.userId;
//   try {
//     // if(!authenticatedUserId) {
//     //     throw createHttpError(401, "User not authenticated");
//     // }
//     // Find the user by the authenticated user id
//     // select("+email") is used to include the 'email' field in the result
//     // exec() is used to execute the query and return a promise
//     const user = await UserModel.findById(req.session.userId)
//       .select("+email")
//       .exec();
//     res.status(200).json(user);
//   } catch (error) {
//     next(error);
//   }
// };

export const getAuthenticatedUser: RequestHandler = async (req, res) => {
  const user = await UserModel.findById(req.userId).select("+email").exec();
  res.status(200).json(user);
};

interface SignUpBody {
  username: string;
  email: string;
  password: string;
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody> = async (
  req,
  res,
  next
) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "All fields are required");
    }

    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) {
      throw createHttpError(409, "Username already exists");
    }

    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) {
      throw createHttpError(409, "Email already exists");
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      email,
      password: passwordHashed,
    });

    // Generate JWT Token
    const token = jwt.sign({ id: newUser._id }, validateEnv.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    next(error);
  }
};

interface LoginBody {
  username: string;
  password: string;
}

export const login: RequestHandler<unknown, unknown, LoginBody> = async (
  req,
  res,
  next
) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      throw createHttpError(400, "All fields are required");
    }

    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    console.log("the user", user);
    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id.toString() },
      validateEnv.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout successful" });
};
