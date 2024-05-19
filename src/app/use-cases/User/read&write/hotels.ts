import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface";

export const getUserHotels=async(
    hotelRepository:ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.getUserHotels()