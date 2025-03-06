import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validateEnv from "../util/validateEnv";
import { assertIsDefined } from "../util/assertIsDefined";

export const getAuthenticatedUser: RequestHandler = async (req, res) => {
  res.status(200).json(req.user);
};

interface SignUpBody {
  username: string;
  email: string;
  password: string;
  userInformation?: {
    name?: string;
    about?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    imageUrl?: string;
  };
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody> = async (
  req,
  res,
  next
) => {
  const { username, email, password, userInformation } = req.body;

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
      userInformation: userInformation || null,
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

    // ✅ Set cookie in response
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false, // 🔥 Must be true for HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 🔥 Allows cross-site requests
      path: "/", // 🔥 Cookie accessible everywhere
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 🔥 7 days expiration
    });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token, // Optional: You can also send it in response body
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: validateEnv.NODE_ENV === "production", // ✅ Secure for HTTPS, false for local
    sameSite: validateEnv.NODE_ENV === "production" ? "none" : "lax", // ✅ Fix for Chrome
    expires: new Date(0), // ✅ Expire immediately
    path: "/", // ✅ Ensure it applies to the whole site
  });
  res.status(200).json({ message: "Logout successful" });
};

interface UpdateUserInformationBody {
  name?: string;
  about?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  twitterUrl?: string;
  imageUrl?: string;
}

export const updateUserInformation: RequestHandler<
  { userId: string }, // Params
  unknown, // Response body (we don't explicitly define it)
  UpdateUserInformationBody // Request body
> = async (req, res, next) => {
  try {
    const authenticatedUserId = req.user?._id; // Ensure req.user exists
    if (!authenticatedUserId) {
      throw createHttpError(401, "Unauthorized");
    }

    const { userId } = req.params; // Extract userId from URL params
    const {
      name,
      about,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      githubUrl,
      twitterUrl,
      imageUrl,
    } = req.body; // Extract user updates

    if (authenticatedUserId.toString() !== userId) {
      throw createHttpError(
        403,
        "Forbidden: You can only update your own information"
      );
    }

    // Find user by ID
    const user = await UserModel.findById(userId);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Update userInformation
    user.userInformation = {
      ...user.userInformation,
      name: name ?? user.userInformation?.name,
      about: about ?? user.userInformation?.about,
      facebookUrl: facebookUrl ?? user.userInformation?.facebookUrl,
      instagramUrl: instagramUrl ?? user.userInformation?.instagramUrl,
      linkedinUrl: linkedinUrl ?? user.userInformation?.linkedinUrl,
      githubUrl: githubUrl ?? user.userInformation?.githubUrl,
      twitterUrl: twitterUrl ?? user.userInformation?.twitterUrl,
      imageUrl: imageUrl ?? user.userInformation?.imageUrl,
    };

    await user.save();

    res.status(200).json({ message: "User information updated", user });
  } catch (error) {
    next(error); // Pass error to middleware
  }
};
