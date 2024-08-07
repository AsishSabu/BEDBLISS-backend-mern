import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"
import { userDbInterfaceType } from "../../../interfaces/userDbInterfaces"

export const blockUser = async (
  id: string,
  userDbRepository: ReturnType<userDbInterfaceType>
) => {
  const user:any= await userDbRepository.getUserById(id)
  await userDbRepository.updateUserBlock(id, !user?.isBlocked)
}
export const blockHotel = async (
  id: string,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
) => {
  const hotel = await hotelDbRepository.getHotelById(id)
  await hotelDbRepository.updateHotelBlock(id, !hotel?.isBlocked)
}

export const verifyHotel = async (
  id: string,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
) => {
  const verifyHotel = await hotelDbRepository.updateHotelVerified(id)

}

export const updateHotel=async(
  id:string,
  updates:any,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
)=>await hotelDbRepository.updateHotel(id,updates)

export const addStayType=async(
  name:string,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
)=>await hotelDbRepository.addStayType(name)

export const updateStayType=async(
  id:string,
  data:Record<string,string|boolean>,
  hotelDbRepository: ReturnType<hotelDbInterfaceType>
)=>
  await hotelDbRepository.updateStayType(id,data)