import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/users";
import bcrypt from "bcrypt";



export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;
    try {
        if(!authenticatedUserId) {
            throw createHttpError(401, "User not authenticated");
        }
        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
} 


interface SignUpBody {
    username: string,
    email: string,
    password: string,
    
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody> = async (req, res, next) => {

    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;


    try {
        if(!username || !email || !passwordRaw) {
            throw createHttpError(400, "All fields are required");
        }
        
        const existingUsername = await UserModel.findOne({username : username}).exec();

        if(existingUsername) {
            throw createHttpError(409, "Username already exists");
        }
        
        const existingEmail = await UserModel.findOne({email : email}).exec();

        if(existingEmail) {
            throw createHttpError(409, "Email already Exist");
        }

        const passwordHashed = await bcrypt.hash(passwordRaw, 10);

        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed
        });

        res.status(201).json(newUser);


      
    } catch (error) {
        next(error);
    }
}

interface LoginBody {
    username?: string,
    password?: string
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    try {
        if(!username || !password) {
            throw createHttpError(400, "All fields are required");
        }

        const user = await UserModel.findOne({username: username}).exec();

        if(!user) {
            throw createHttpError(401, "Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            throw createHttpError(401, "Invalid credentials");
        }

        req.session.userId = user._id;
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((err) => {
        if(err) {
            next(err);
        } else {
            res.status(200).json({message: "Logout successful"});
        }
    });
};