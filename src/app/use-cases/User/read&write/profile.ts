import {
  NotificationInterface,
  UserInterface,
} from "../../../../types/userInterfaces"
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces"

export const getUserProfile = async (
  userID: string,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  const user = await userRepository.getUserById(userID)
  return user
}

export const updateUser = async (
  userID: string,
  updateData: UserInterface,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.updateProfile(userID, updateData)

export const verifyNumber = async (
  phoneNumber: string,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  const user = await userRepository.getUserByNumber(phoneNumber)
  console.log(user)
}
export const AddNotification = async (
  id: string,
  notification: NotificationInterface,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.addNotifications(id, notification)

export const removeNotification = async (
  userId: string,
  notificationId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.removeNotifications(userId, notificationId)

export const markAsReadNotification = async (
  userId: string,
  notificationId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.markAsRead(userId, notificationId)

export const markAllAsReadNotification = async (
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.markAllAsRead(userId)

export const clearAllReadNotification = async (
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.clearReadNotifications(userId)

