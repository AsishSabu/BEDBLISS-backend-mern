import { Dates, HotelInterface, optionType } from "./../../../types/HotelInterface"
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"
import Room from "../models/roomModel"
import { RoomEntityType } from "../../../entites/room"
import { NextFunction } from "express"
import mongoose from "mongoose"

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
    roomId: string;
    roomNumbers: number[];
  }
  
  const  addUnavilableDates= async (
    rooms: RoomDetails[],
    dates: string[]
  ) => {
      for (const room of rooms) {
      const roomId = room.roomId;
      const roomNumbers = room.roomNumbers;
  
      for (const roomNumber of roomNumbers) {
        await Room.updateOne(
          { _id: roomId, "roomNumbers.number": roomNumber },
          { $addToSet: { "roomNumbers.$.unavailableDates": { $each: dates } } }
        );
      }
    }
  
   return
  };

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
    const Hotels = await Hotel.find({
      isVerified: true,
      isListed: true,
    })
    const count = Hotels.length

    return { Hotels, count }
  }
  const getMyHotels = async (ownerId: string) => {
    const Hotels = await Hotel.find({ ownerId })
    return Hotels
  }

  const getHotelDetails = async (id: string) => {
    const Hotels = await Hotel.findById(id).populate("rooms")
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

  const splitDate = (dateString:string) => {
    const [date, time] = dateString.split('T');
    const timeWithoutZ = time.replace('Z', ''); // Remove 'Z' from time
    return { date, time: timeWithoutZ };
  };


  const findByDestination = async (
    destination: string,
    adults: string,
    children: string,
    room: string,
    startDate: string,
    endDate: string
  ) => {
    console.log("in find by destination");
  
  
    if (destination === "") {
     return await Hotel.find({ isVerified: true, isListed: true });
    } 
      const regex = new RegExp(destination, "i");
     const hotels:any = await Hotel.find({
        $or: [
          { destination: { $regex: regex } },
          { name: { $regex: regex } },
        ],
        isVerified: true,
        isListed: true,
      });
   
  
    console.log(hotels,"destinaiton filter");
    const availableRooms = await Promise.all(
      hotels.map(async (hotel:any) => {
        const hotelObj = hotel.toObject();
        const availableRoomNumbers = await Promise.all(
          hotelObj.rooms.map(async (room: any) => {
            const isRoomAvailable = room.roomNumbers.some((roomNumber: any) => {
              const isAvailable = roomNumber.unavailableDates.every(
                (unavailableDate: any) => {
                  const date = new Date(unavailableDate);
                  return date < new Date(startDate) || date > new Date(endDate);
                }
              );
              return isAvailable;
            });
  
            if (isRoomAvailable) {
              return room.number;
            }
  
            return null;
          })
        );
  
        const availableRoomNumbersFiltered = availableRoomNumbers.filter(
          (roomNumber) => roomNumber !== null
        );
  
        return {
          hotel: hotelObj.name,
          availableRoomNumbers: availableRoomNumbersFiltered,
        };
      })
    );
    console.log(availableRooms);
    
  
    // return availableRooms.filter((room) => room.availableRoomNumbers.length > 0);
  };
  

  const updateHotelVerified = async (id: string) => {
    await Hotel.findOneAndUpdate({ _id: id }, { isVerified: true })
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
    addRoom,
    deleteRoom,
    addUnavilableDates
  }
}
export type hotelDbRepositoryType = typeof hotelDbRepository
