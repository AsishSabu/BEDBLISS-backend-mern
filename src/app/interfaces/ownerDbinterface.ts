import { UserEntityType } from "../../entites/user";
import { ownerRepositoryMongoDb } from "../../frameworks/database/repositories/ownerRepository";

export const ownerDbRepository = (
  repository: ReturnType<ownerRepositoryMongoDb>
) => {
  const getOwnerByEmail = async (email: string) =>
    await repository.getOwnerEmail(email);

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

  return{
    getOwnerByEmail,
    addOwner,
    addOtp,
    findOtpWithOwner,
    deleteOtpWithOwner,
    updateOwnerverification
  }
};

export type ownerDbInterface=typeof ownerDbRepository
