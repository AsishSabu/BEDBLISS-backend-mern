import {
  UserEntityType,
  GoogleandFaceebookUserEntityType,
} from "../../../entites/user"
import mongoose, { Types } from "mongoose"
import otpModel from "../models/otpModel"
import transaction from "../models/transaction"
import User from "../models/userModel"
import wallet from "../models/wallet"
import { UserInterface } from "./../../../types/userInterfaces"
import { TransactionEntityType } from "../../../entites/transactionEntity"

interface ChangeUserRole {
  id: string
  newRole: string
}

export const userDbRepository = () => {
  //get user by email
  const getUserEmail = async (email: string) => {
    const user: UserInterface | null = await User.findOne({ email })
    return user
  }

  const getUserbyId = async (id: string): Promise<UserInterface | null> => {
    const user = await User.findById(id).populate("wallet").lean()

    if (!user) {
      return null
    }
    const { _id, ...rest } = user
    return { id: _id.toString(), ...rest } as UserInterface
  }

  //add user
  const addUser = async (user: UserEntityType) => {
    const newUser: any = new User({
      name: user.getName(),
      email: user.getEmail(),
      password: user.getPassword(),
      role: user.getUserRole(),
    })

    newUser.save()
    return newUser
  }

  // ada otp
  const addOtp = async (otp: string, userId: string) => {
    await otpModel.create({ otp, userId })
  }

  const findUserOtp = async (userId: string) =>
    await otpModel.findOne({ userId })

  const deleteUserOtp = async (userId: string) =>
    await otpModel.deleteOne({ userId })

  const updateUserVerified = async (userId: string) => {
    await User.findOneAndUpdate({ _id: userId }, { isVerified: true })
  }

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
    )

  const updateVerificationCode = async (email: string, code: string) =>
    await User.findOneAndUpdate({ email }, { verificationCode: code })

  const changeUserRole = async (id: string, newRole: string) => {
    console.log(`Changing role to: ${newRole}`)

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { role: newRole },
        { new: true } // This option returns the updated document
      )

      if (!updatedUser) {
        console.log("User not found")
        return null
      }

      console.log("Role updated successfully:", updatedUser)
      return updatedUser
    } catch (error) {
      console.error("Error updating role:", error)
      throw error
    }
  }
  const updateUserInfo = async (id: string, updateData: Record<string, any>) =>
    await User.findByIdAndUpdate(id, updateData, { new: true })

  const getUserByNumber = async (phoneNumber: string) => {
    const user: UserInterface | null = await User.findOne({ phoneNumber })
    return user
  }

  const getAllUsers = async () => {
    const users = await User.find({ isVerified: true })
    const allUsers = await User.find()
    const count = allUsers.length
    return { users, count }
  }

  const updateUserBlock = async (id: string, status: boolean) =>
    await User.findByIdAndUpdate(id, { isBlocked: status })

  const addWallet = async (userId: string) => await wallet.create({ userId })

  const updateWallet = async (userId: string, newBalance: number) =>
    await wallet.findOneAndUpdate(
      { userId },
      { $inc: { balance: newBalance } },
      { new: true }
    )

  const getWalletByUseId = async (Id: string) => {
    console.log(Id)

    return await wallet.findOne({ userId: Id })
  }

  const createTransaction = async (transactionDetails: TransactionEntityType) =>
    await transaction.create({
      walletId: transactionDetails.getWalletId(),
      type: transactionDetails.getType(),
      description: transactionDetails.getDescription(),
      amount: transactionDetails.getAmount(),
    })

  const allTransactions = async (walletId: mongoose.Types.ObjectId) =>
    await transaction
      .find({ walletId })
      .sort({ createdAt: -1 })
      .populate("walletId")

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
    getUserByNumber,
    getAllUsers,
    updateUserBlock,
    changeUserRole,
    updateWallet,
    createTransaction,
    getWalletByUseId,
    addWallet,
    allTransactions,
  }
}

export type userDbRepositoryType = typeof userDbRepository
