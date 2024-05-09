import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import HttpError from "../http.error";
import * as userService from "./user.service";

const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password, dateOfBirth, location } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userService.signup(name, email, hashedPassword, new Date(), dateOfBirth, location);
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    
    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    next(new HttpError("Signup failed",  500));
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
   
    const user = await userService.findUserByEmail(email);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new HttpError("Invalid email or password", 401);
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
    
    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    next(new HttpError("Login failed", 500));
  }
};

const viewProfile = async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const userId = req.userId;
  try {
   
    const userProfile = await userService.viewProfile(userId);
    
    res.status(200).json(userProfile);
  } catch (error) {
    next(new HttpError("View profile failed", 500));
  }
};

const editProfile = async (req: Request & { userId: string }, res: Response, next: NextFunction) => {
  const userId = req.userId;
  const { firstName, lastName, dateOfBirth } = req.body;
  try {
    
    const updatedUser = await userService.editProfile(userId, firstName, lastName, dateOfBirth);
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(new HttpError("Edit profile failed", 500));
  }
};

export { signup, login, viewProfile, editProfile };
