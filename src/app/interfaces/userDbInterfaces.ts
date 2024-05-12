import {
  GoogleandFaceebookUserEntityType,
  UserEntityType,
} from "../../entites/user";
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB";

export const userDbInterface = (
  repository: ReturnType<userDbRepositoryType>
) => {
  const getUserByEmail = async (email: string) =>
    await repository.getUserEmail(email);

  const getUserById = async (id: string) => await repository.getUserbyId(id);

  const addUser = async (user: UserEntityType) =>
    await repository.addUser(user);
 
  const updateUserBlock=async(id:string,status:boolean)=>
    await repository.updateUserBlock(id,status)

  const addOtp = async (otp: string, id: string) =>
    await repository.addOtp(otp, id);

  const findOtpWithUser = async (userId: string) =>
    await repository.findUserOtp(userId);

  const deleteOtpWithUser = async (userId: string) =>
    await repository.deleteUserOtp(userId);

  const updateUserverification = async (userId: string) =>
    await repository.updateUserVerified(userId);

  const registerGooglefacebookoUser = async (
    user: GoogleandFaceebookUserEntityType
  ) => await repository.registerGoogleFacebookSignedUser(user);

  const verifyAndResetPassword = async (
    verificationCode: string,
    password: string
  ) =>
    await repository.findVerificationCodeAndUpdate(verificationCode, password);

  const updateVerificationCode = async (
    email: string,
    verificationCode: string
  ) => await repository.updateVerificationCode(email, verificationCode);

  const updateProfile = async (userId: string, userData: Record<string, any>) =>
    await repository.updateUserInfo(userId, userData);

  const getUserByNumber=async(phoneNumber:string)=>
    await repository.getUserByNumber(phoneNumber)

  const getAllUsers=async(role:string)=>
    await repository.getAllUsers(role)

  return {
    getUserByEmail,
    addUser,
    addOtp,
    findOtpWithUser,
    deleteOtpWithUser,
    updateUserverification,
    registerGooglefacebookoUser,
    verifyAndResetPassword,
    updateVerificationCode,
    getUserById,
    updateProfile,
    getUserByNumber,
    getAllUsers,
    updateUserBlock
  };
};

export type userDbInterfaceType = typeof userDbInterface;
