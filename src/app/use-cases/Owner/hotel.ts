import mongoose from "mongoose"
import createHotelEntity, { HotelEntityType } from "../../../entites/hotel"
import { HotelInterface } from "../../../types/HotelInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface"
import { RoomInterface } from "../../../types/RoomInterface"
import createRoomEntity, { RoomEntityType } from "../../../entites/room"

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
    amenities,
    imageUrls,
    // coordinates,
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
    amenities,
    imageUrls,
    // coordinates,
    address,
    ownerDocument,
    hotelDocument,
    ownerPhoto
  )

  const newHotel = await hotelRepository.addHotel(hotelEntity)

  return newHotel
}

export const addRoom = async (
  hotelId: mongoose.Types.ObjectId,
  hotel: RoomInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const { title, price, desc, maxChildren, maxAdults, roomNumbers } = hotel;

  // Correctly map the roomNumbers array
  const formattedRoomNumbers = roomNumbers.map((num: number) => ({
    number: num,
    unavailableDates: []
  }));
  const roomEntity: RoomEntityType = createRoomEntity(
    title,
    price,
    desc,
    maxChildren,
    maxAdults,
    formattedRoomNumbers
  );

  const newHotel = await hotelRepository.addRoom(roomEntity, hotelId);

  return newHotel;
}

export const getHotels = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getAllHotels()

export const getMyHotels = async (
  ownerId: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getMyHotels(ownerId)


export const hotelUpdate=async(
  hotelId:string,
  updates:any,
  hotelRepository: ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.updateHotel(hotelId,updates)

export const roomUpdate=async(
  roomId:string,
  updates:any,
  hotelRepository: ReturnType<hotelDbInterfaceType>
)=>await hotelRepository.updateRoom(roomId,updates)

export const offerUpdate=async(
  hotelId:string,
  updates:any,
  hotelRepository: ReturnType<hotelDbInterfaceType>

)=>await hotelRepository.offerUpdate(hotelId,updates)

export const offerRemove=async(
  hotelId:string,
  hotelRepository: ReturnType<hotelDbInterfaceType>

)=>await hotelRepository.offerRemove(hotelId)