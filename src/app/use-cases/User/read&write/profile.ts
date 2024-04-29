import { userDbInterface } from "../../../interfaces/userDbRepositories";
import { UserInterface } from "../../../../types/userInterfaces";


export const getUserProfile = async (
  userID: string,
  userRepository: ReturnType<userDbInterface>
) => {
  const user = await userRepository.getUserById(userID);
  return user ;
};

export const   updateUser = async (
  userID: string,
  updateData: UserInterface,
  userRepository: ReturnType<userDbInterface>
) => await userRepository.updateProfile(userID, updateData);