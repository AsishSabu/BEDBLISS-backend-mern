import { HotelEntityType } from "../../entites/hotel";
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";

export const hotelDbInterface = (
  repository: ReturnType<hotelDbRepositoryType>
) => {
  const addHotel = async (hotel: HotelEntityType) =>
    await repository.addHotel(hotel);

  const getHotelByName = async (name: string) =>
    await repository.getHotelByName(name);

  const getHotelByEmail = async (email: string) =>
    await repository.getHotelEmail(email);

  const getAllHotels = async () => await repository.getAllHotels();

  const getUserHotels = async () => await repository.getUserHotels();

  const getMyHotels = async (ownerId: string) =>
    await repository.getMyHotels(ownerId);

  return {
    addHotel,
    getHotelByName,
    getHotelByEmail,
    getAllHotels,
    getMyHotels,
    getUserHotels
  };
};

export type hotelDbInterfaceType = typeof hotelDbInterface;
