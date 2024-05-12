import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const blockUser=async(
    id:string,
    userDbRepository:ReturnType<userDbInterfaceType>
)=>{
    const user=await userDbRepository.getUserById(id);
    await userDbRepository.updateUserBlock(id,!user?.isBlocked)
}