import { bookingDbInterfaceType } from "../../../interfaces/bookingDbInterface";
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces";

export const getUsers=async(
    role:string,
    userDbRepository:ReturnType<userDbInterfaceType>,
)=>await userDbRepository.getAllUsers(role);

export const getALLBookings = async (
    bookingRepository: ReturnType<bookingDbInterfaceType>
  ) => await bookingRepository.getAllBooking()
