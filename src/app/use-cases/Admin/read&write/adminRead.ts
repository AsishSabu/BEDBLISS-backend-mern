import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const getUsers=async(
    userDbRepository:ReturnType<userDbInterfaceType>,
    role:string
)=>await userDbRepository.getAllUsers(role);

