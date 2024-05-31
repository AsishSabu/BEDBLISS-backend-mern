import mongoose from "mongoose"
import createHotelEntity, { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../../../frameworks/database/models/hotelModel"
import { HotelInterface } from "../../../types/HotelInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface"

export const addHotel = async (
  ownerId: mongoose.Types.ObjectId,
  hotel: HotelInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const {
    name,
    destination,
    stayType,
    description,
    propertyRules,
    room,
    bed,
    bathroom,
    guests,
    amenities,
    imageUrls,
    reservationType,
    address,
    hotelDocument,
    ownerPhoto,
  } = hotel
  const existingHotel = await hotelRepository.getHotelByName(name)
  if (existingHotel) {
    throw new AppError(
      "Hotel with this name already exists",
      HttpStatus.UNAUTHORIZED
    )
  }
  const ownerDocument = ""

  const hotelEntity: HotelEntityType = createHotelEntity(
    ownerId,
    name,
    destination,
    stayType,
    description,
    propertyRules,
    room,
    bed,
    bathroom,
    guests,
    amenities,
    imageUrls,
    reservationType,
    address,
    ownerDocument,
    hotelDocument,
    ownerPhoto
  )

  const newHotel = await hotelRepository.addHotel(hotelEntity)

  return newHotel
}
export const getHotels = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getAllHotels()

export const getMyHotels = async (
  ownerId: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getMyHotels(ownerId)
