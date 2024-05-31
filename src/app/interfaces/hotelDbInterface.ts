import { HotelEntityType } from "../../entites/hotel"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel)

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

  const findByDestination = async (destination: string) =>
    await repository.findByDestination(destination)
  
  const updateHotelVerified= async (id: string) =>
    await repository.updateHotelVerified(id)
  return {
    addHotel,
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
    updateHotelVerified
  }
}

export type hotelDbInterfaceType = typeof hotelDbInterface
