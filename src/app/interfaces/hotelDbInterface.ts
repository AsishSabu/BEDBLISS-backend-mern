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

  const addSaved = async (userId: string, hotelId: mongoose.Types.ObjectId) =>
    await repository.addOrRemoveFromSaved(userId, hotelId)

  const removeSaved = async (
    userId: string,
    hotelId: mongoose.Types.ObjectId
  ) => await repository.removeFromSaved(userId, hotelId)

  const Saved = async (userId: string) =>
    await repository.getSavedHotels(userId)

  const addStayType = async (name: string) => await repository.addStayType(name)

  const StayTypeById = async (id: string) => await repository.StayTypeById(id)

  const StayTypeByName = async (name: string) =>
    await repository.StayTypeByName(name)

  const StayTypes = async () => await repository.allStayTypes()

  const updateStayType = async (
    id: string,
    data: Record<string, string | boolean>
  ) => await repository.updateStayType(id, data)

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

  const updateHotel = async (id: string, updates: any) =>
    await repository.update(id, updates)

  const updateRoom = async (id: string, updates: any) =>
    await repository.updateRoom(id, updates)

  const offerUpdate = async (id: string, updates: any) =>
    await repository.updateOffer(id, updates)

  const offerRemove = async (id: string) => await repository.removeOffer(id)

  const removeHotel = async (id: string) => await repository.remove(id)

  const filterHotels = async (
    destination: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    amenities: string,
    minPrice: string,
    maxPrice: string,
    categories: string,
    skip: number,
    limit: number
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
      categories,
      skip,
      limit
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
    count: number,
    checkInDate: string,
    checkOutDate: string
  ) => await repository.checkAvailability(id, count, checkInDate, checkOutDate)

  const addUnavilableDates = async (room: [], dates: string[]) =>
    await repository.addUnavilableDates(room, dates)

  const removeUnavailableDates = async (room: [], dates: string[]) =>
    await repository.removeUnavailableDates(room, dates)

  const addRating = async (ratingData: RatingEntityType) =>
    await repository.addRating(ratingData)

  const getRatings = async (filter: Record<string, any>) =>
    await repository.getRatings(filter)

  const getRatingById = async (id: string) => await repository.getRatingById(id)

  const updateRatings = async (id: string, updates: Record<string, any>) =>
    await repository.updateRatingById(id,updates)

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
    getRatingById,
    updateRatings,
    addSaved,
    removeSaved,
    updateRoom,
    Saved,
    offerUpdate,
    offerRemove,
  }
}

export type hotelDbInterfaceType = typeof hotelDbInterface
