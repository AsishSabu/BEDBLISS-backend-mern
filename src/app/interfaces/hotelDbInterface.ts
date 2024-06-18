import mongoose from "mongoose"
import { HotelEntityType } from "../../entites/hotel"
import { RoomEntityType } from "../../entites/room"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"
import { Dates, optionType } from "../../types/HotelInterface"

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel)

  const addRoom = async (
    hotel: RoomEntityType,
    hotelId: mongoose.Types.ObjectId
  ) => await repository.addRoom(hotel, hotelId)

  const addStayType = async (name:string) =>
    await repository.addStayType(name)


  const getHotelById = async (Id: string) => await repository.getHotelById(Id)

  const getHotelByName = async (name: string) =>
    await repository.getHotelByName(name)

  const getHotelByEmail = async (email: string) =>
    await repository.getHotelEmail(email)

  const getAllHotels = async () => await repository.getAllHotels()

  const getUserHotels = async () => await repository.getUserHotels()

  const getMyHotels = async (ownerId: string) =>
    await repository.getMyHotels(ownerId)

  const getHotelDetails = async (id: string) =>
    await repository.getHotelDetails(id)

  const updateHotelBlock = async (id: string, status: boolean) =>
    await repository.updateHotelBlock(id, status)

  const updateHotel = async (id: string, updates: HotelEntityType) =>
    await repository.update(id, updates)

  const removeHotel = async (id: string) => await repository.remove(id)

  const findByDestination = async (
    destination: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string
  ) =>
    await repository.findByDestination(
      destination,
      adults,
      children,
      room,
      startDate,
      endDate
    )

  const updateHotelVerified = async (id: string) =>
    await repository.updateHotelVerified(id)

  const updateUnavailableDates = async (id: string, dates: any) =>
    await repository.updateUnavailableDates(id, dates)

  const checkAvailability = async (
    id: string,
    checkInDate: string,
    checkOutDate: string
  ) => await repository.checkAvailability(id, checkInDate, checkOutDate)

  const addUnavilableDates = async (room: [], dates: string[]) =>
    await repository.addUnavilableDates(room, dates)
  const removeUnavailableDates = async (room: [], dates: string[]) =>
    await repository.removeUnavailableDates(room, dates)

  return {
    addHotel,
    addRoom,
    addStayType,
    getHotelByName,
    getHotelByEmail,
    getAllHotels,
    getMyHotels,
    getUserHotels,
    getHotelDetails,
    getHotelById,
    updateHotelBlock,
    updateHotel,
    removeHotel,
    findByDestination,
    updateHotelVerified,
    updateUnavailableDates,
    checkAvailability,
    addUnavilableDates,
    removeUnavailableDates
  }
}

export type hotelDbInterfaceType = typeof hotelDbInterface
