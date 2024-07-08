import { bookingDbInterfaceType } from "../../../interfaces/bookingDbInterface"
import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces"

export const getUsers = async (
  role: string,
  userDbRepository: ReturnType<userDbInterfaceType>
) => await userDbRepository.getAllUsers(role)

export const getALLBookings = async (
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getAllBooking()

export const getAllstayTypes = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.StayTypes()

export const getStayTypeById = async (
  id: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.StayTypeById(id)

export const getStayTypeByName = async (
    name: string,
    hotelRepository: ReturnType<hotelDbInterfaceType>
  ) => await hotelRepository.StayTypeByName(name)
  