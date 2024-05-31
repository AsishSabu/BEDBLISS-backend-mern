import { HotelInterface } from "./../../../types/HotelInterface"
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"

export const hotelDbRepository = () => {
  const addHotel = async (hotel: HotelEntityType) => {
    const newHotel: any = new Hotel({
      name: hotel.getName(),
      address:hotel.getAddress(),
      ownerId:hotel.getOwnerId(),
      destination:hotel.getDestination(),
      stayType:hotel.getStayType(),
      propertyRules:hotel.getPropertyRules(),
      description: hotel.getDescription(),
      room: hotel.getRoom(),
      bed:hotel.getBed(),
      bathroom:hotel.getBathroom(),
      guests:hotel.getGuests(),
      amenities: hotel.getAmenities(),
      imageUrls: hotel.getImageUrls(),
      reservationType:hotel.getReservationType(),
      ownerDocument:hotel.getOwnerDocument(),
      hotelDocument:hotel.getHotelDocument(),
      ownerPhoto:hotel.getOwnerPhoto()
    })
    newHotel.save()
    return newHotel
  }

  const getHotelById = async (Id: string) => {
    const hotel: HotelInterface | null = await Hotel.findById(Id)
    return hotel
  }
  const getHotelByName = async (name: string) => {
    const hotel: HotelInterface | null = await Hotel.findOne({ name })
    return hotel
  }
  const getHotelEmail = async (email: string) => {
    const user: HotelInterface | null = await Hotel.findOne({ email })
    return user
  }
  const getAllHotels = async () => {
    const Hotels = await Hotel.find({})
    const count = Hotels.length
    return { Hotels, count }
  }
  const getUserHotels = async () => {
    const Hotels = await Hotel.find({})
    const count = Hotels.length
    return { Hotels, count }
  }
  const getMyHotels = async (ownerId: string) => {
    const Hotels = await Hotel.find({ ownerId })
    return Hotels
  }

  const getHotelDetails = async (id: string) => {
    const Hotels = await Hotel.findById(id)
    return Hotels
  }
  const updateHotelBlock = async (id: string, status: boolean) =>
    await Hotel.findByIdAndUpdate(id, { isBlocked: status })

  const update = async (id: string, updates: HotelEntityType) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
      new: true,
    })
    return updatedHotel
  }

  const remove = async (id: string) => await Hotel.deleteOne({ _id: id })

  const findByDestination = async (filter: string) => {
    const regex = new RegExp(filter, "i"); // "i" for case-insensitive matching
    return await Hotel.find({
      $or: [
        { place: { $regex: regex } },
        { name: { $regex: regex } }
      ]
    });
  };
  

  return {
    addHotel,
    getHotelByName,
    getHotelEmail,
    getAllHotels,
    getMyHotels,
    getUserHotels,
    getHotelDetails,
    getHotelById,
    updateHotelBlock,
    update,
    remove,
    findByDestination,
  }
}
export type hotelDbRepositoryType = typeof hotelDbRepository
