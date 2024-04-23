import { ObjectId } from "mongoose";
import { UserEntityType } from "../../../entites/user";
import otpModel from "../models/otpModel";
import User from "../models/userModel";
import { UserInterface } from "./../../../types/userInterfaces";

export const userRepositoryMongoDb = () => {
  //get user by email
  const getUserEmail = async (email: string) => {
    const user: UserInterface | null = await User.findOne({ email });
    return user;
  };
  //add user
  const addUser = async (user: UserEntityType) => {
    const newUser: any = new User({
      name: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      password: user.getPassword(),
    });
    newUser.save();
    return newUser;
  };

  // ada otp
  const addOtp = async (otp: string, userId: string) => {
    await otpModel.create({ otp, userId });
  };

  const findUserOtp = async (userId: string) =>
    await otpModel.findOne({ userId });

  const deleteUserOtp = async (userId: string) =>
    await otpModel.deleteOne({ userId });

  const updateUserVerified = async (userId: string) => {
    await User.findOneAndUpdate({ _id: userId }, { isVerified: true });
  };

  return {
    getUserEmail,
    addUser,
    addOtp,
    findUserOtp,
    deleteUserOtp,
    updateUserVerified,
  };
};

export type userRepositoryMongoDb = typeof userRepositoryMongoDb;
