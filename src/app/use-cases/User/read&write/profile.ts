import { UserInterface } from "../../../../types/userInterfaces";
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const getUserProfile = async (
  userID: string,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  const user = await userRepository.getUserById(userID);
  return user;
};

export const updateUser = async (
  userID: string,
  updateData: UserInterface,
  userRepository: ReturnType<userDbInterfaceType>
) => await userRepository.updateProfile(userID, updateData);
