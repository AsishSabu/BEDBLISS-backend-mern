import mongoose from "mongoose"
import { HotelEntityType } from "../../entites/hotel"
import { RoomEntityType } from "../../entites/room"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"
import { Dates, optionType } from "../../types/HotelInterface"
import { RatingEntityType } from "../../entites/rating"

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel)

  const addRoom = async (
    hotel: RoomEntityType,
    hotelId: mongoose.Types.ObjectId
  ) => await repository.addRoom(hotel, hotelId)

  const addStayType = async (name: string) => await repository.addStayType(name)

  const StayTypeById = async (id: string) => await repository.StayTypeById(id)

  const StayTypeByName = async (name: string) =>
    await repository.StayTypeByName(name)

  const StayTypes = async () => await repository.allStayTypes()

  const updateStayType = async (id: string, data: Record<string, string|boolean>) =>
    await repository.updateStayType(id, data)

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

  const filterHotels = async (
    destination: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    amenities: string[],
    minPrice: string,
    maxPrice: string,
    categories: string[]
  ) =>
    await repository.filterHotels(
      destination,
      adults,
      children,
      room,
      startDate,
      endDate,
      amenities,
      minPrice,
      maxPrice,
      categories
    )
  const UserfilterHotelBYId = async (
    id: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    minPrice: string,
    maxPrice: string
  ) =>
    await repository.UserfilterHotelBYId(
      id,
      adults,
      children,
      room,
      startDate,
      endDate,
      minPrice,
      maxPrice
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

  const addRating = async (ratingData: RatingEntityType) =>
    await repository.addRating(ratingData)

  const getRatings = async (filter: Record<string, any>) =>
    await repository.getRatings(filter)

  return {
    addHotel,
    addRoom,
    addStayType,
    StayTypeById,
    StayTypeByName,
    StayTypes,
    updateStayType,
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
    filterHotels,
    UserfilterHotelBYId,
    updateHotelVerified,
    updateUnavailableDates,
    checkAvailability,
    addUnavilableDates,
    removeUnavailableDates,
    addRating,
    getRatings,
  }
}

export type hotelDbInterfaceType = typeof hotelDbInterface
