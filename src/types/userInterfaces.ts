import mongoose, { Document } from "mongoose";

// User and Notification interfaces
export interface CreateUserInterface {
  name: string;
  email: string;
  password: string;
  role: string;
}

// Define interfaces for nested schemas
interface NotificationData {
  senderId: mongoose.Types.ObjectId;
  name: string;
  image:string;
  onClickPath: string;
}

export interface NotificationInterface {
  _id:string;
  type: string;
  message: string;
  data: NotificationData;
  read: boolean;
  createdAt: Date;
}

export interface WalletInterface {
  userId: mongoose.Types.ObjectId;
  balance: number;
}

// Define main User interface
export interface UserInterface {
  id: string; // Use `id` instead of `_id`
  name: string;
  email: string;
  phoneNumber?: string; // Make phoneNumber optional if it's not always present
  dob?: string;
  state?: string;
  country?: string;
  password: string;
  profilePic: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
  wallet?: mongoose.Types.ObjectId | WalletInterface; // Allow for both ID and populated object
  notifications: NotificationInterface[];
  verificationCode?: string;
  createdAt: Date;
  updatedAt: Date;
}
