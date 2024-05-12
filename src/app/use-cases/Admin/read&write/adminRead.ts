import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const getUsers=async(
    userDbRepository:ReturnType<userDbInterfaceType>
)=>await userDbRepository.getAllUsers();

