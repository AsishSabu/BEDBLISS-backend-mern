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
  adults: string,
  children: string,
  room: string,
  startDate: string,
  endDate: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const data = await hotelRepository.findByDestination(
    destination,
    adults,
    children,
    room,
    startDate,
    endDate
  )
  return data
}
