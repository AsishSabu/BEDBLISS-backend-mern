import otpModel from "../models/otpModel";
import Owner from "../models/ownerMOdel";
import { OwnerInterface } from "../../../types/OwnerInterfaces";
import { UserEntityType } from "../../../entites/user";

export const ownerRepositoryMongoDb = () => {
  //get owner by email
  const getOwnerEmail = async (email: string) => {
    const owner: OwnerInterface | null = await Owner.findOne({ email });
    return owner;
  };
  //add user
  const addOwner = async (owner: UserEntityType) => {
    const newOwner: any = new Owner({
      name: owner.getName(),
      email: owner.getEmail(),
      phoneNumber: owner.getPhoneNumber(),
      password: owner.getPassword(),
    });
    newOwner.save();
    return newOwner;
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
    await Owner.findOneAndUpdate({ _id: userId }, { isVerified: true });
  };
  return{
    getOwnerEmail,
    addOwner,
    addOtp,
    findUserOtp,
    deleteUserOtp,
    updateUserVerified,
  }
};
export type ownerRepositoryMongoDb=typeof ownerRepositoryMongoDb;
