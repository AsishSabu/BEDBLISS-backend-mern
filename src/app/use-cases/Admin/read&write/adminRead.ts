import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const getUsers=async(
    role:string,
    userDbRepository:ReturnType<userDbInterfaceType>,
)=>await userDbRepository.getAllUsers(role);

