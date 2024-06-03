import { HotelInterface } from "./../../../types/HotelInterface"
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"

export const hotelDbRepository = () => {
  const addHotel = async (hotel: HotelEntityType) => {
    const newHotel: any = new Hotel({
      name: hotel.getName(),
      address: hotel.getAddress(),
      ownerId: hotel.getOwnerId(),
      destination: hotel.getDestination(),
      stayType: hotel.getStayType(),
      propertyRules: hotel.getPropertyRules(),
      description: hotel.getDescription(),
      room: hotel.getRoom(),
      price: hotel.getPrice(),
      bed: hotel.getBed(),
      bathroom: hotel.getBathroom(),
      guests: hotel.getGuests(),
      amenities: hotel.getAmenities(),
      imageUrls: hotel.getImageUrls(),
      reservationType: hotel.getReservationType(),
      ownerDocument: hotel.getOwnerDocument(),
      hotelDocument: hotel.getHotelDocument(),
      ownerPhoto: hotel.getOwnerPhoto(),
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
    const regex = new RegExp(filter, "i") // "i" for case-insensitive matching
    return await Hotel.find({
      $or: [{ place: { $regex: regex } }, { name: { $regex: regex } }],
    })
  }

  const updateHotelVerified = async (id: string) => {
    await Hotel.findOneAndUpdate({ _id: id }, { isVerified: true })
  }

  const updateUnavailableDates = async (id: string, dates: any) =>
    await Hotel.updateOne(
      { _id: id },
      { $addToSet: { unavailableDates: { $each: dates } } }
    )
    const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
      const dates: Date[] = [];
      let currentDate = new Date(startDate);
    
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    
      return dates;
    };
    
    // Function to check availability
    const checkAvailability = async (id: string, checkInDate: string, checkOutDate: string) => {
      // Convert strings to Date objects
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
    
      // Get the hotel by ID
      const hotel = await Hotel.findById(id).select("unavailableDates");
    
      if (!hotel) {
        throw new Error("Hotel not found");
      }
    
      // Ensure unavailableDates is defined and is an array
      if (!Array.isArray(hotel.unavailableDates)) {
        throw new Error("Unavailable dates is not an array");
      }
    
      // Get all dates in the range
      const datesInRange = getDatesInRange(checkIn, checkOut);
      console.log(datesInRange, "....................");
    
      // Check if any of these dates are in the unavailableDates array
      const isUnavailable = datesInRange.some(date =>
        hotel.unavailableDates.some(unavailableDate =>
          unavailableDate.getTime() === date.getTime()
        )
      );
      console.log("////////////////////////",isUnavailable);
      
    
      return !isUnavailable;
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
    updateHotelVerified,
    updateUnavailableDates,
    checkAvailability,
  }
}
export type hotelDbRepositoryType = typeof hotelDbRepository
