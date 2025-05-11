import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from "../models/user.model";
import { isValidEmail } from '../utils/validators';

export const createAccount = async (req: Request, res: Response): Promise<Response> => {

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    const isUser = await User.findOne({ email });

    if (isUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const accesstoken = jwt.sign(
        { id: newUser._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '1h' }
    );

    return res.status(201).json({
        user: { fullName: newUser.fullName, email: newUser.email },
        accesstoken,
        message: "User created successfully"
    });
}

export const logIn = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const accesstoken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '1h' }
    );

    res.cookie('token', accesstoken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
    });

    return res.status(200).json({
        user: { fullName: user.fullName, email: user.email },
        accesstoken,
        message: "Login successful"
    });
}

export const logOut = (req: Request, res: Response): Response => {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
};

export const getUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id: userId } = (req as any).user;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: "Server error" });
    }
};