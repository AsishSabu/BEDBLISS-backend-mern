import {
  Dates,
  HotelInterface,
  optionType,
  RoomInterface,
} from "./../../../types/HotelInterface"
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"
import Room from "../models/roomModel"
import { RoomEntityType } from "../../../entites/room"
import { NextFunction } from "express"
import mongoose from "mongoose"
import Category from "../models/categoryModel"
import { getDates } from "../../../utils/DateHelper"
import AppError from "../../../utils/appError"
import { RatingEntityType } from "../../../entites/rating"
import Rating from "../models/reviewModel"

export const hotelDbRepository = () => {
  //adding hotel

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
      reservationType: hotel.getReservationType(),
      ownerDocument: hotel.getOwnerDocument(),
      hotelDocument: hotel.getHotelDocument(),
      ownerPhoto: hotel.getOwnerPhoto(),
    })
    newHotel.save()
    return newHotel
  }

  //adding room to hotel

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
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
    return newRoom
  }

  const addStayType = async (name: string) => {
    const newCategory: any = new Category({
      title: name,
    })
    newCategory.save()
    return newCategory
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
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    }
  }

  interface RoomDetails {
    roomId: string
    roomNumbers: number[]
  }

  const addUnavilableDates = async (rooms: RoomDetails[], dates: string[]) => {
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
    const Hotels = await Hotel.find({})
    console.log(Hotels, "..............")

    const count = Hotels.length
    return { Hotels, count }
  }

  const getUserHotels = async () => {
    const Hotels = await Hotel.aggregate([
      {
        $match: {
          isVerified: "verified",
          isListed: true,
          isBlocked: false,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $match: {
          "owner.isBlocked": false,
        },
      },
      {
        $project: {
          name: 1,
          destination: 1,
          address: 1,
          stayType: 1,
          description: 1,
          propertyRules: 1,
          rooms: 1,
          amenities: 1,
          isBlocked: 1,
          isListed: 1,
          imageUrls: 1,
          reservationType: 1,
          isVerified: 1,
          hotelDocument: 1,
          ownerPhoto: 1,
          Reason: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: 1,
            name: 1,
            email: 1,
            phoneNumber: 1,
            profilePic: 1,
            isBlocked: 1,
          },
        },
      },
    ])

    const count = Hotels.length

    return { Hotels, count }
  }

  const getMyHotels = async (ownerId: string) => {
    const Hotels = await Hotel.find({ ownerId })
    return Hotels
  }

  const getHotelDetails = async (id: string) => {
    const Hotels = await Hotel.findById(id)
      .populate("rooms")
      .populate("ownerId")
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

  const splitDate = (dateString: string) => {
    const [date, time] = dateString.split("T")
    const timeWithoutZ = time.replace("Z", "") // Remove 'Z' from time
    return { date, time: timeWithoutZ }
  }

  const getDates = async (startDate: string, endDate: string) => {
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

  const findByDestination = async (
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
  ): Promise<HotelInterface[]> => {
    let hotels: any

    if (destination === "") {
      hotels = await Hotel.find({
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    } else {
      const regex = new RegExp(destination, "i")
      hotels = await Hotel.find({
        $or: [{ destination: { $regex: regex } }, { name: { $regex: regex } }],
        isVerified: "verified",
        isListed: true,
        isBlocked: false,
      }).populate("rooms")
    }
    const adultsInt = parseInt(adults)
    const childrenInt = parseInt(children)

    const peopleFilter = hotels.filter((hotel: HotelInterface) =>
      hotel.rooms.some(
        (room: RoomInterface) =>
          room.maxAdults >= adultsInt && room.maxChildren >= childrenInt
      )
    )

    const dates = await getDates(startDate, endDate)
    console.log(dates, "dates")

    const isRoomNumberAvailable = (roomNumber: {
      number: number
      unavailableDates: Date[]
    }): boolean => {
      return !roomNumber.unavailableDates.some((date: Date) =>
        dates.includes(date.toISOString().split("T")[0])
      )
    }

    let availableHotels

    availableHotels = peopleFilter
      .map((hotel: HotelInterface) => ({
        ...hotel,
        rooms: hotel.rooms
          .map((room: RoomInterface) => ({
            ...room,
            roomNumbers: room.roomNumbers.filter(isRoomNumberAvailable),
          }))
          .filter((room: any) => room.roomNumbers.length > 0),
      }))
      .filter((hotel: any) => hotel.rooms.length > 0)

    if (categories && Array.isArray(categories)) {
      availableHotels = availableHotels.filter((hotel: any) => {
        return categories.includes(hotel.stayType)
      })
    }

    if (minPrice && maxPrice) {
      const min = parseInt(minPrice)
      const max = parseInt(maxPrice)
      console.log(minPrice, maxPrice, "Price range values")

      try {
        availableHotels = availableHotels.filter((hotel: HotelInterface) => {
          const hasRoomInRange = hotel.rooms.some((room: RoomInterface) => {
            // console.log(room, "room before price filter////////////////////////////////////////////////////////////////////////////");
            // const price = room.price !== undefined ? room.price : room?.price;
            // console.log(price, "..........//././././/./././.");
            // if (price === undefined) {
            //   console.log("Price is undefined:", room);
            //   return false;
            // }
            // if (typeof price !== 'number') {
            //   console.log(`Invalid price format: ${price}`);
            //   return false;
            // }
            // const isPriceInRange = price >= min && price <= max;
            // console.log(`Price ${price} is in range (${min}, ${max}): ${isPriceInRange}`);
            // return isPriceInRange;
          })
          // console.log(`Hotel ${hotel.name} has room in range: ${hasRoomInRange}`);
          return hasRoomInRange
        })
        // console.log(availableHotels, "availableHotels after price filter");
      } catch (error) {
        console.log(error)
      }
    }
    return availableHotels
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
    checkInDate: string,
    checkOutDate: string
  ) => {
    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)

    const hotel = await Hotel.findById(id).select("unavailableDates")

    // if (!hotel) {
    //   throw new Error("Hotel not found");
    // }

    // // if (!Array.isArray(hotel.unavailableDates)) {
    // //   throw new Error("Unavailable dates is not an array");
    // // }

    // const datesInRange = getDatesInRange(checkIn, checkOut);
    // // Check if any of these dates are in the unavailableDates array
    // const isUnavailable = datesInRange.some(date =>
    //   hotel.unavailableDates.some(unavailableDate =>
    //     unavailableDate.getTime() === date.getTime()
    //   )
    // );
    // return !isUnavailable;
  }

  const addRating = async (ratingData: RatingEntityType) =>
    await Rating.create({
      userId: ratingData.getUserId(),
      hotelId: ratingData.getHotelId(),
      rating: ratingData.getRating(),
      description: ratingData.getDescription(),
      imageUrls: ratingData.getImageUrls(),
    })

  const getRatings = async (filter: Record<string, any>) =>
    await Rating.find(filter).populate("userId")

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
    findByDestination,
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
  }
}
export type hotelDbRepositoryType = typeof hotelDbRepository
