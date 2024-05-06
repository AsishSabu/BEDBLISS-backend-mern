import {
  UserEntityType,
  GoogleandFaceebookUserEntityType,
} from "../../../entites/user";
import otpModel from "../models/otpModel";
import User from "../models/userModel";
import { UserInterface } from "./../../../types/userInterfaces";

export const userDbRepository= () => {

  //get user by email
  const getUserEmail = async (email: string) => {
    const user: UserInterface | null = await User.findOne({ email });
    return user;
  };

  const getUserbyId = async (id: string) =>{
    const user: UserInterface | null = await User.findById(id);
    return user
  } 

  //add user
  const addUser = async (user: UserEntityType) => {
        const newUser: any = new User({
      name: user.getName(),
      email: user.getEmail(),
      phoneNumber: user.getPhoneNumber(),
      password: user.getPassword(),
      role:user.getUserRole()
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

  const registerGoogleFacebookSignedUser = async (
    user: GoogleandFaceebookUserEntityType
  ) =>
    await User.create({
      name: user.name(),
      email: user.email(),
      profilePic: user.picture(),
      isVerified: user.email_verified(),
      role:user.getUserRole()
    });

  const findVerificationCodeAndUpdate = async (
    code: string,
    newPassword: string
  ) =>
    await User.findOneAndUpdate(
      { verificationCode: code },
      { password: newPassword, verificationCode: null },
      { upsert: true }
    );

  const updateVerificationCode = async (email: string, code: string) =>
    await User.findOneAndUpdate({ email }, { verificationCode: code });

  const updateUserInfo = async (id: string, updateData: Record<string, any>) =>
    await User.findByIdAndUpdate(id, updateData, { new: true });

  const getUserByNumber=async(phoneNumber:string)=> {
    const user: UserInterface | null = await User.findOne({ phoneNumber });
    return user;
  };
  return {
    getUserEmail,
    addUser,
    addOtp,
    findUserOtp,
    deleteUserOtp,
    updateUserVerified,
    registerGoogleFacebookSignedUser,
    findVerificationCodeAndUpdate,
    updateVerificationCode,
    getUserbyId,
    updateUserInfo,
    getUserByNumber
  };
};

export type userDbRepositoryType = typeof userDbRepository;
