import { GoogleandFaceebookUserEntityType, UserEntityType } from "../../entites/user";
import { userRepositoryMongoDb } from "./../../frameworks/database/repositories/userRepostoryMongoDB";

export const userDbRepository = (
  repository: ReturnType<userRepositoryMongoDb>
) => {
  const getUserByEmail = async (email: string) =>
    await repository.getUserEmail(email);

  const addUser = async (user: UserEntityType) =>
    await repository.addUser(user);

  const addOtp = async (otp: string, id: string) =>
    await repository.addOtp(otp, id);

  const findOtpWithUser = async (userId: string) =>
    await repository.findUserOtp(userId);

  const deleteOtpWithUser = async (userId: string) =>
    await repository.deleteUserOtp(userId);

  const updateUserverification = async (userId: string) =>
    await repository.updateUserVerified(userId);

  const registerGooglefacebookoUser=async(user:GoogleandFaceebookUserEntityType)=>
    await repository.registerGoogleFacebookSignedUser(user)

  const verifyAndResetPassword = async (verificationCode: string,password: string) =>
    await repository.findVerificationCodeAndUpdate(verificationCode, password);

  const updateVerificationCode = async (
    email: string,
    verificationCode: string
  ) => await repository.updateVerificationCode(email, verificationCode);
  return {
    getUserByEmail,
    addUser,
    addOtp,
    findOtpWithUser,
    deleteOtpWithUser,
    updateUserverification,
    registerGooglefacebookoUser,
    verifyAndResetPassword,
    updateVerificationCode
  };
};

export type userDbInterface = typeof userDbRepository;
