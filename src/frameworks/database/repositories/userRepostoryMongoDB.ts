import {
  UserEntityType,
  GoogleandFaceebookUserEntityType,
} from "../../../entites/user"
import mongoose, { Types } from "mongoose"
import otpModel from "../models/otpModel"
import transaction from "../models/transaction"
import User from "../models/userModel"
import wallet from "../models/wallet"
import {
  NotificationInterface,
  UserInterface,
} from "./../../../types/userInterfaces"
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
    try {
      const userDoc = await User.findById(id).populate("wallet").lean()

      if (!userDoc) {
        return null
      }

      // Transform notifications
      const transformedNotifications: NotificationInterface[] =
        userDoc.notifications.map((notification: any) => ({
          _id:notification._id??"",
          type: notification.type ?? "",
          message: notification.message ?? "",
          data: {
            senderId:
              notification.data?.senderId ?? new mongoose.Types.ObjectId(),
            name: notification.data?.name ?? "",
            image:notification.data?.image?? "",
            onClickPath: notification.data?.onClickPath ?? "",
          },
          read: notification.read ?? false,
          createdAt: notification.createdAt ?? new Date(),
        }))

      // Transform the user to ensure all fields are properly typed
      const transformedUser: UserInterface = {
        id: userDoc._id.toString(), // Convert `_id` to `id`
        name: userDoc.name ?? "", // Ensure name is a string
        email: userDoc.email ?? "",
        phoneNumber: userDoc.phoneNumber ?? undefined,
        dob: userDoc.dob ?? undefined,
        state: userDoc.state ?? undefined,
        country: userDoc.country ?? undefined,
        password: userDoc.password ?? "",
        profilePic: userDoc.profilePic ?? "", // Ensure profilePic is a string
        role: userDoc.role ?? "user", // Ensure role is a string
        isVerified: userDoc.isVerified ?? false,
        isBlocked: userDoc.isBlocked ?? false,
        wallet: userDoc.wallet ?? undefined,
        notifications: transformedNotifications,
        createdAt: userDoc.createdAt ?? new Date(),
        updatedAt: userDoc.updatedAt ?? new Date(),
        verificationCode: userDoc.verificationCode ?? undefined,
      }

      return transformedUser
    } catch (error) {
      console.error("Error fetching user:", error)
      return null
    }
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
      role: user.getUserRole(),
    })

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

  const getAllUsers = async (role: string) => {
    const users = await User.find({ isVerified: true, role: role }).sort({
      updatedAt: -1,
    })
    const allUsers = await User.find({ role: role })
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

  const addNotifications = async (
    id: string,
    notification: NotificationInterface
  ) => {
    try {
      const receiver = await User.findById(id).sort({ createdAt: 1 })
      if (!receiver) {
        throw new Error("User not found")
      }
      receiver.notifications.push(notification)
      await receiver.save()
      return receiver
    } catch (error) {
      console.error("Error adding notification:", error)
      throw error
    }
  }

  const deleteNotification = async (userId: string, notificationId: string) => {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }

      const notification = user.notifications.id(notificationId)
      if (!notification) {
        throw new Error("Notification not found")
      }

      user.notifications.pull({ _id: notificationId })
      await user.save()
      return user
    } catch (error) {
      console.error("Error deleting notification:", error)
      throw error
    }
  }

  const markNotificationAsRead = async (
    userId: string,
    notificationId: string
  ) => {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }
      const notification = user.notifications.id(notificationId)
      if (!notification) {
        throw new Error("Notification not found")
      }
      notification.read = true
      await user.save()
      return user
    } catch (error) {
      console.error("Error marking notification as read:", error)
      throw error
    }
  }

  const markAllNotificationsAsRead = async (userId: string) => {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }

      user.notifications.forEach(notification => {
        notification.read = true
      })

      await user.save()
      return user
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      throw error
    }
  }

  const clearAllReadNotifications= async (userId: string) => {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }
      user.notifications = user.notifications.filter(
        notification => !notification.read
      ) as any
      await user.save()
      return user
    } catch (error) {
      console.error("Error clearing read notifications:", error)
      throw error
    }
  }
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
    addNotifications,
    deleteNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllReadNotifications,
  }
}

export type userDbRepositoryType = typeof userDbRepository
