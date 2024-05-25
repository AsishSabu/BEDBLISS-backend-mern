import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"

export const getUserHotels = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getUserHotels()

export const getHotelDetails = async (
  id: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getHotelDetails(id)

export const viewByDestination = async (
  destination: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const data = await hotelRepository.findByDestination(destination)
  return data
}
