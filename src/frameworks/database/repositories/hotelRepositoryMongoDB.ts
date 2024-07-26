import { HotelInterface, RoomInterface } from "./../../../types/HotelInterface"
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"
import Room from "../models/roomModel"
import { RoomEntityType } from "../../../entites/room"
import mongoose from "mongoose"
import Category from "../models/categoryModel"
import { RatingEntityType } from "../../../entites/rating"
import Rating from "../models/reviewModel"
import Saved from "../models/savedModel"
import { title } from "process"

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
      amenities: hotel.getAmenities(),
      imageUrls: hotel.getImageUrls(),
      // coordinates: hotel.getCordinatesType(),
      ownerDocument: hotel.getOwnerDocument(),
      hotelDocument: hotel.getHotelDocument(),
      ownerPhoto: hotel.getOwnerPhoto(),
    })
    newHotel.save()
    return newHotel
  }

  const addRoom = async (
    room: RoomEntityType,
    hotelId: mongoose.Types.ObjectId
  ) => {
    const newRoom: any = new Room({
      title: room.getTitle(),
      price: room.getPrice(),
      maxChildren: room.getMaxChildren(),
      maxAdults: room.getMaxAdults(),
      desc: room.getDescription(),
      roomNumbers: room.getRoomNumbers(),
    })
    try {
      const savedRoom = await newRoom.save()
      try {
        await Hotel.findByIdAndUpdate(hotelId, {
          $push: { rooms: savedRoom._id },
        })
      } catch (error) {
      }
    } catch (error) {
    }
    return newRoom
  }

  const getSavedHotels = async (id: string) => {
    try {
      const savedHotels = await Saved.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(id) } },
        { $unwind: "$Hotels" },
        {
          $lookup: {
            from: "hotels",
            localField: "Hotels",
            foreignField: "_id",
            as: "hotelDetails",
          },
        },
        { $unwind: "$hotelDetails" },
        {
          $match: {
            "hotelDetails.isVerified": "verified",
            "hotelDetails.isListed": true,
            "hotelDetails.isBlocked": false,
          },
        },
        {
          $group: {
            _id: "$_id",
            Hotels: { $push: "$hotelDetails" },
          },
        },
      ])

      // If there are saved hotels, return the Hotels array, otherwise return an empty array
      return savedHotels.length > 0 ? savedHotels[0].Hotels : []
    } catch (error) {
      console.error("Error fetching verified saved hotels:", error)
      throw error
    }
  }

  const addOrRemoveFromSaved = async (
    id: string,
    hotelId: mongoose.Types.ObjectId
  ) => {
    try {
      const savedEntry = await Saved.findOne({ userId: id })
      let message = ""

      if (savedEntry) {
        const hotelIndex = savedEntry.Hotels.indexOf(hotelId)

        if (hotelIndex === -1) {
          // Hotel is not in the list, add it
          savedEntry.Hotels.push(hotelId)
          message = "Hotel added to saved list"
        } else {
          // Hotel is in the list, remove it
          savedEntry.Hotels.splice(hotelIndex, 1)
          message = "Hotel removed from saved list"
        }
        await savedEntry.save()
      } else {
        // No saved entry found, create a new one and add the hotel
        const newSavedEntry = new Saved({
          userId: id,
          Hotels: [hotelId],
        })
        await newSavedEntry.save()
      }

      const updatedSavedEntry = await Saved.findOne({ userId: id }).populate(
        "Hotels"
      )
      return { updatedSavedEntry, message }
    } catch (error) {
      console.error("Error updating saved list:", error)
      throw error
    }
  }

  const removeFromSaved = async (
    id: string,
    hotelId: mongoose.Types.ObjectId
  ) => {
    try {
      const savedEntry = await Saved.findOne({ userId: id })
      if (savedEntry) {
        savedEntry.Hotels = savedEntry.Hotels.filter(
          hotel => hotel.toString() !== hotelId.toString()
        )
        await savedEntry.save()
        const updatedSavedEntry = await Saved.findOne({ userId: id }).populate(
          "Hotels"
        )
        return updatedSavedEntry
      } else {
        return null
      }
    } catch (error) {
      console.error("Error removing from saved list:", error)
      throw error
    }
  }

  const addStayType = async (name: string) => {
    const newCategory: any = new Category({
      name: name,
    })
    newCategory.save()
    return newCategory
  }

  const StayTypeById = async (id: string) => await Category.findById(id)

  const StayTypeByName = async (name: string) => {
    const result = await Category.find({ name })
    return result
  }

  const allStayTypes = async () => await Category.find().sort({ createdAt: -1 })

  const updateStayType = async (
    id: string,
    data: Record<string, string | boolean>
  ) => {
    const result = await Category.findByIdAndUpdate(id, data)
    return result
  }

  const deleteRoom = async (
    roomId: mongoose.Types.ObjectId,
    hotelId: mongoose.Types.ObjectId
  ) => {
    try {
      await Room.findByIdAndDelete(roomId)
      try {
        await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } })
      } catch (error) {
      }
    } catch (error) {
    }
  }

  interface RoomDetails {
    roomId: string
    roomNumbers: number[]
  }

  const addUnavilableDates = async (rooms: RoomDetails[], dates: string[]) => {
    try {
      for (const room of rooms) {
        const roomId = room.roomId
        const roomNumbers = room.roomNumbers
  
        for (const roomNumber of roomNumbers) {
          await Room.updateOne(
            { _id: roomId, "roomNumbers.number": roomNumber },
            { $addToSet: { "roomNumbers.$.unavailableDates": { $each: dates } } }
          )
        }
      }
  
      return
    } catch (error) {
      console.error("Error in add unavailable dates:", error)
      throw error
    }

  }

  const removeUnavailableDates = async (
    rooms: RoomDetails[],
    dates: string[]
  ) => {
    for (const room of rooms) {
      const roomId = room.roomId
      const roomNumbers = room.roomNumbers

      for (const roomNumber of roomNumbers) {
        await Room.updateOne(
          { _id: roomId, "roomNumbers.number": roomNumber },
          { $pull: { "roomNumbers.$.unavailableDates": { $in: dates } } }
        )
      }
    }

    return
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
    const Hotels = await Hotel.find({}).populate("ownerId").sort({ updatedAt: -1 })
    const count = Hotels.length
    return { Hotels, count }
  }

  const getUserHotels = async () => {
    const Hotels = await Hotel.find({
      isBlocked: false,
      isVerified: "verified",
      isListed: true
    })
    .populate({
      path: 'stayType',
      match: { isListed: true }
    })
    .populate({
      path: 'ownerId',
      match: { isBlocked: false }
    })
    .populate("rooms");
  
    // Filter out hotels where stayType or ownerId is null after population
    const filteredHotels = Hotels.filter(hotel => hotel.stayType && hotel.ownerId);
  
    const count = filteredHotels.length;
  
    return { Hotels: filteredHotels, count };
  }

  const getMyHotels = async (ownerId: string) => {
    const Hotels = await Hotel.find({ ownerId })
    return Hotels
  }

  const getHotelDetails = async (id: string) => {
    const Hotels = await Hotel.findById(id)
      .populate("rooms")
      .populate("ownerId")
      .populate("rating")
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

  const updateRoom = async (id: string, updates: HotelEntityType) => {
    const updatedRoom = await Room.findByIdAndUpdate(id, updates, {
      new: true,
    })
    return updatedRoom
  }
  const updateOffer = async (id: string, updates: any) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, {
      offer: updates,
    })
    return updatedHotel
  }

  const removeOffer = async (hotelId: string) => {
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, {
      $unset: { offer: "" },
    })
    return updatedHotel
  }

  const remove = async (id: string) => await Hotel.deleteOne({ _id: id })

  const splitDate = (dateString: string) => {    
    const [date, time] = dateString.split("T")
    const timeWithoutZ = time.replace("Z", "") // Remove 'Z' from time
    return { date, time: timeWithoutZ }
  }

  const getDates = async (startDate: any, endDate: any) => {
    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    const datesArray: string[] = []

    while (currentDate <= end) {
      const formattedDate = new Date(currentDate)
      formattedDate.setUTCHours(0, 0, 0, 0)
      datesArray.push(formattedDate.toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return datesArray
  }

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
  ) => {
    let hotels: any[]    

    if (destination) {
      const regex = new RegExp(destination, "i")
      hotels = await Hotel.find({
        $or: [{ destination: { $regex: regex } }, { name: { $regex: regex } }],
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    } else {
      hotels = await Hotel.find({
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    }

    const adultsInt = adults ? parseInt(adults) : 0
    const childrenInt = children ? parseInt(children) : 0

    hotels = hotels.filter((hotel: HotelInterface) => {
      const filteredRooms = hotel.rooms.filter((room: RoomInterface) => {
        return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt
      })
      if (filteredRooms.length > 0) {
        hotel.rooms = filteredRooms
        return true
      }
      return false
    })

    const start = splitDate(startDate)
    const end = splitDate(endDate)
    const dates = await getDates(start.date, end.date)

    const isRoomNumberAvailable = (roomNumber: {
      number: number
      unavailableDates: Date[]
    }): boolean => {
      return !roomNumber.unavailableDates.some((date: Date) => {
        const curr = new Date(date).toISOString().split("T")[0]
        return dates.includes(curr)
      })
    }

    if (minPrice && maxPrice && parseInt(maxPrice) !== 0) {
      const minPriceInt = parseInt(minPrice)
      const maxPriceInt = parseInt(maxPrice)
      hotels = hotels.filter((hotel: HotelInterface) => {
        const filteredRooms = hotel.rooms.filter((room: RoomInterface) => {
          const result =
            room.price !== undefined &&
            room.price >= minPriceInt &&
            room.price <= maxPriceInt
          return result
        })
        if (filteredRooms.length > 0) {
          hotel.rooms = filteredRooms
          return true
        }
        return false
      })
    }

    if (amenities) {
      const amenitiesArr = amenities.split(",")
      hotels = hotels.filter(hotel => {
        return amenitiesArr.some(amenity => hotel.amenities.includes(amenity))
      })
    }


    if (categories) {
      const categoriesArr = categories.split(",");
      hotels = hotels.filter(hotel => {
        return categoriesArr.some(category => hotel.stayType === category);
      });
    }
    const totalLength=hotels.length
    const paginatedHotels = hotels.slice(skip, skip + limit)

    return {paginatedHotels,totalLength}
  }

  const UserfilterHotelBYId = async (
    id: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string,
    minPrice: string,
    maxPrice: string
  ) => {
    try {
      // Fetch the hotel by ID and populate rooms
      const hotel = await Hotel.findById(id).populate("rooms")

      if (!hotel) {
        throw new Error("Hotel not found")
      }

      // Convert string inputs to numbers
      const adultsInt = adults ? parseInt(adults) : 0
      const childrenInt = children ? parseInt(children) : 0

      // Filter rooms based on max adults and children
      hotel.rooms = hotel.rooms.filter((room: any) => {
        return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt
      })

      // Split start and end dates into parts
      const start = splitDate(startDate)
      const end = splitDate(endDate)

      // Get dates between start and end date
      const dates = await getDates(start.date, end.date)

      // Function to check room availability
      const isRoomNumberAvailable = (roomNumber: {
        number: number
        unavailableDates: Date[]
      }): boolean => {
        return !roomNumber.unavailableDates.some((date: Date) => {
          const curr = new Date(date).toISOString().split("T")[0]
          return dates.includes(curr)
        })
      }

      // Filter rooms again based on availability
      hotel.rooms.forEach((room: any) => {
        room.roomNumbers = room.roomNumbers.filter(isRoomNumberAvailable)
      })

      // Filter out rooms that have no available room numbers
      hotel.rooms = hotel.rooms.filter(
        (room: any) => room.roomNumbers.length > 0
      )

      // Return the hotel with filtered rooms
      return hotel
    } catch (error) {
      console.error("Error filtering hotel:", error)
      throw error
    }
  }

  const updateHotelVerified = async (id: string) => {
    await Hotel.findOneAndUpdate({ _id: id }, { isVerified: "verified" })
  }
  const updateHotelRejected = async (
    id: string,
    updatingData: Record<any, any>
  ) => {
    await Hotel.findOneAndUpdate({ _id: id }, updatingData, {
      new: true,
      upsert: true,
    })
  }

  const updateUnavailableDates = async (id: string, dates: any) =>
    await Hotel.updateOne(
      { _id: id },
      { $addToSet: { unavailableDates: { $each: dates } } }
    )
  const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = []
    let currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  const checkAvailability = async (
    id: string,
    RoomCount: number,
    checkInDate: string,
    checkOutDate: string
  ) => {
    const checkIn = splitDate(checkInDate);
    const checkOut = splitDate(checkOutDate);  
    const dateArray = await getDates(checkIn.date, checkOut.date);
    const formattedDateArray = dateArray.map((date) => new Date(date).toISOString().split("T")[0]);
  
    try {
      // Find the room by ID
      const roomExist: RoomInterface | null = await Room.findById(id); 
      if (!roomExist) {
        throw new Error("Room not found");
      }
        const availableRooms = []; 
      // Iterate over roomNumbers
      for (const room of roomExist.roomNumbers) {
        let isAvailable = true; 
        // Check each date in dateArray against unavailableDates
        for (const unavailableDate of room.unavailableDates) {
          const formattedUnavailableDate = new Date(unavailableDate).toISOString().split("T")[0];
          if (formattedDateArray.includes(formattedUnavailableDate)) {
            isAvailable = false;
            break; // No need to check further dates for this room
          }
        } 
        if (isAvailable) {
          availableRooms.push(room);
        }
        // Stop checking if we've found enough rooms
        if (availableRooms.length === RoomCount) {
          break;
        }
      }
      if(availableRooms.length>=RoomCount){
        return {
          rooms: availableRooms.slice(0, RoomCount),
          roomDetails: {
            _id: roomExist._id,
            title: roomExist.title,
            price: roomExist.price,
            maxChildren: roomExist.maxChildren,
            maxAdults: roomExist.maxAdults,
            desc: roomExist.desc,
          },
        };

      }else{
        return null;
      }
    } catch (error) {
      console.error("Error checking room availability:", error);
      throw error;
    }
  };

  const addRating = async (ratingData: RatingEntityType) => {
    const result = new Rating({
      userId: ratingData.getUserId(),
      hotelId: ratingData.getHotelId(),
      rating: ratingData.getRating(),
      description: ratingData.getDescription(),
      imageUrls: ratingData.getImageUrls(),
    })
    const savedRating = await result.save()

    try {
      await Hotel.findByIdAndUpdate(savedRating.hotelId, {
        $push: { rating: savedRating._id },
      })
    } catch (error) {
    }

    return savedRating
  }

  const getRatings = async (filter: Record<string, any>) =>
    await Rating.find(filter).populate("userId")

  const getRatingById = async (id:string) =>
    await Rating.findById(id).populate("userId")

  const updateRatingById = async (id: string, updates: Record<string, any>) => {
    try {
      const result = await Rating.findByIdAndUpdate(id, updates, { new: true });
      return result;
    } catch (error) {
      console.error('Error updating rating:', error);
      throw error;
    }
  };

  return {
    addHotel,
    addStayType,
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
    filterHotels,
    updateHotelVerified,
    updateHotelRejected,
    updateUnavailableDates,
    checkAvailability,
    addRoom,
    deleteRoom,
    addUnavilableDates,
    removeUnavailableDates,
    addRating,
    getRatings,
    getRatingById,
    updateRatingById,
    UserfilterHotelBYId,
    StayTypeById,
    allStayTypes,
    updateStayType,
    StayTypeByName,
    getSavedHotels,
    addOrRemoveFromSaved,
    removeFromSaved,
    updateRoom,
    updateOffer,
    removeOffer,
  }
}
export type hotelDbRepositoryType = typeof hotelDbRepository
