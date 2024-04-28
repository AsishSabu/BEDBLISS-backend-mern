import { GoogleandFaceebookUserEntityType, UserEntityType } from "../../entites/user";
import { ownerRepositoryMongoDb } from "../../frameworks/database/repositories/ownerRepository";

export const ownerDbRepository = (
  repository: ReturnType<ownerRepositoryMongoDb>
) => {
  const getOwnerByEmail = async (email: string) =>
    await repository.getOwnerEmail(email);

  const getOwnerById = async (id: string) =>
    await repository.getOwnerbyId(id);

  const addOwner = async (user: UserEntityType) =>
    await repository.addOwner(user);

  const addOtp = async (otp: string, id: string) =>
    await repository.addOtp(otp, id);

  const findOtpWithOwner = async (userId: string) =>
    await repository.findUserOtp(userId);

  const deleteOtpWithOwner = async (userId: string) =>
    await repository.deleteUserOtp(userId);

  const updateOwnerverification = async (userId: string) =>
    await repository.updateUserVerified(userId);

  const registerGooglefacebookoOwner=async(owner:GoogleandFaceebookUserEntityType)=>
    await repository.registerGoogleFacebookSignedOwner(owner)

  return{
    getOwnerByEmail,
    addOwner,
    addOtp,
    findOtpWithOwner,
    deleteOtpWithOwner,
    updateOwnerverification,
    registerGooglefacebookoOwner,
    getOwnerById
  }
};

export type ownerDbInterface=typeof ownerDbRepository
