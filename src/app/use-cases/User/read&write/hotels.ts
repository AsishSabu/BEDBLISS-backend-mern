import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface";

export const getUserHotels=async(
    hotelRepository:ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.getUserHotels()

export const getHotelDetails=async(
    id:string,
    hotelRepository:ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.getHotelDetails(id)