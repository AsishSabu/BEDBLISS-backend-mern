import { hotelDbRepositoryType } from "./../../frameworks/database/repositories/hotelRepositoryMongoDB"
import { Request, Response, NextFunction, query } from "express"
import {
  addHotel,
  addRoom,
  getMyHotels,
  hotelUpdate,
  offerRemove,
  offerUpdate,
  roomUpdate,
} from "../../app/use-cases/Owner/hotel"
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface"
import { HttpStatus } from "../../types/httpStatus"
import {
  addNewRating,
  addToSaved,
  filterHotels,
  getHotelDetails,
  getSaved,
  getUserHotels,
  hotelDetailsFilter,
  ratings,
  removeFromSaved,
  ReviewById,
  updateReviewById,
} from "../../app/use-cases/User/read&write/hotels"
import mongoose from "mongoose"
import { checkAvailability } from "../../app/use-cases/Booking/booking"
import { bookingDbInterfaceType } from "../../app/interfaces/bookingDbInterface"
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB"

const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType,
  bookingDbRepository: bookingDbInterfaceType,
  bookingDbRepositoryImp: bookingDbRepositoryType,
) => {
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl())
  const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp())

  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = new mongoose.Types.ObjectId(req.user)
      const hotelData = req.body
      const registeredHotel = await addHotel(
        ownerId,
        hotelData,
        dbRepositoryHotel
      )
      res.json({
        status: "success",
        message: "hotel added suuccessfully",
        registeredHotel,
      })
    } catch (error) {
      next(error)
    }
  }

  const registerRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const hotelId = new mongoose.Types.ObjectId(req.params.id)
      const roomData = req.body

      const registeredRoom = await addRoom(hotelId, roomData, dbRepositoryHotel)
      res.json({
        status: "success",
        message: "room added suuccessfully",
        registeredRoom,
      })
    } catch (error) {
      next(error)
    }
  }

  const addSaved = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user
      const hotelId = new mongoose.Types.ObjectId(req.params.id)
      const { updatedSavedEntry, message } = await addToSaved(
        userId,
        hotelId,
        dbRepositoryHotel
      )

      res.json({
        status: "success",
        message,
        savedRoom: updatedSavedEntry,
      })
    } catch (error) {
      next(error)
    }
  }

  const removeSaved = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user
      const hotelId = new mongoose.Types.ObjectId(req.params.id)
      const savedRoom = await removeFromSaved(
        userId,
        hotelId,
        dbRepositoryHotel
      )
      res.json({
        status: "success",
        message: "hotel removed from saved suuccessfully",
        savedRoom,
      })
    } catch (error) {
      next(error)
    }
  }

  const savedHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user
      const savedHotels = await getSaved(userId, dbRepositoryHotel)
      res.json({
        status: "success",
        message: " saved hotels fetched succefully",
        savedHotels,
      })
    } catch (error) {
      next(error)
    }
  }

  const registeredHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user
      const Hotels = await getMyHotels(ownerId, dbRepositoryHotel)
      return res.status(HttpStatus.OK).json({ success: true, Hotels })
    } catch (error) {
      next(error)
    }
  }

  const getHotelsUserSide = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { Hotels } = await getUserHotels(dbRepositoryHotel)
      return res.status(HttpStatus.OK).json({ success: true, Hotels })
    } catch (error) {
      next(error)
    }
  }

  const hotelDetails = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id
      const Hotel = await getHotelDetails(id, dbRepositoryHotel)
      if (Hotel) {
        return res.status(HttpStatus.OK).json({ success: true, Hotel })
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false })
      }
    } catch (error) {
      next(error)
    }
  }

  const hotelsFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const destination = req.query.destination as string
      const adults = req.query.adult as string
      const children = req.query.children as string
      const room = req.query.room as string
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string
      const amenities = req.query.amenities as string
      const minPrice = req.query.minAmount as string
      const maxPrice = req.query.maxAmount as string
      const stayTypes = req.query.stayTypes as string
      const page = parseInt(req.query.page as string) || 1
      const limit = 4
      const skip = (page - 1) * limit
      const data = await filterHotels(
        destination,
        adults,
        children,
        room,
        startDate,
        endDate,
        amenities,
        minPrice,
        maxPrice,
        stayTypes,
        dbRepositoryHotel,
        skip,
        limit
      )      
      res.status(HttpStatus.OK).json({
        status: "success",
        message: "search result has been fetched",
        data: data,
      })
    } catch (error) {
      next(error)
    }
  }

  const DetailsFilter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.query.id as string
      const adults = req.query.adult as string
      const children = req.query.children as string
      const room = req.query.room as string
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string
      const minPrice = req.body.minPrice as string
      const maxPrice = req.body.maxPrice as string

      const data = await hotelDetailsFilter(
        id,
        adults,
        children,
        room,
        startDate,
        endDate,
        minPrice,
        maxPrice,
        dbRepositoryHotel
      )
      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Hotel details fetched",
        data,
      })
    } catch (error) {
      next(error)
    }
  }

  const checkAvilabitiy = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {dates,count} = req.body
      const id = req.params.id
      const RoomAvailable= await checkAvailability(
        id,
        count,
        dates,
        dbRepositoryHotel
      )
      if(RoomAvailable){
        res.status(HttpStatus.OK).json({
          status: "success",
          message: "date is availble",
          RoomAvailable,
        })
      }else{
        res.status(HttpStatus.OK).json({
          status: "fail",
          message: "date is unavailble",
        })
      }
    } catch (error) {
      next(error)
    }
  }

  const listUnlistHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { value } = req.body
      const updates = {
        isListed: value,
      }
      await hotelUpdate(id, updates, dbRepositoryHotel)
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "  Successfully updated" })
    } catch (error) {
      next(error)
    }
  }

  const listUnlistRoom = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { value } = req.body
      const updates = {
        listed: value,
      }
      const response = await roomUpdate(id, updates, dbRepositoryHotel)
      if (response) {
        if (response.listed) {
          return res
            .status(HttpStatus.OK)
            .json({ success: true, message: " Room listed Successfully " })
        } else {
          return res
            .status(HttpStatus.OK)
            .json({ success: true, message: " Room Unlisted Successfully " })
        }
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false })
      }
    } catch (error) {
      next(error)
    }
  }

  const editRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const updates = req.body
      const response = await roomUpdate(id, updates, dbRepositoryHotel)
      if (response) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: " Room edited Successfully " })
      }
    } catch (error) {
      next(error)
    }
  }

  const editHotel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await hotelUpdate(id, req.body, dbRepositoryHotel)
      if (result) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: " hotel updated successfully " })
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false })
      }
    } catch (error) {
      next(error)
    }
  }

  const addOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await offerUpdate(id, req.body, dbRepositoryHotel)
      if (result) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: "offer added Successfully " })
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false })
      }
    } catch (error) {
      next(error)
    }
  }

  const removeOffer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const result = await offerRemove(id, dbRepositoryHotel)
      if (result) {
        return res
          .status(HttpStatus.OK)
          .json({ success: true, message: " offer removed Successfully" })
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({ success: false })
      }
    } catch (error) {
      next(error)
    }
  }

  const addRating = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user
    const data = req.body
    
    const result = await addNewRating(userId, data, dbRepositoryHotel,dbRepositoryBooking)
    if (result) {
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "  Successfully added rating" })
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }

  const getRatingsbyHotelId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const hotelId = req.params.hotelId
    const result = await ratings(hotelId, dbRepositoryHotel)
    if (result) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "  Successfully getted rating",
        result,
      })
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }

  const getRatingsbyId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const Id = req.params.Id    
    const result = await ReviewById(Id, dbRepositoryHotel)    
    if (result) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "  Successfully getted rating",
        result,
      })
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }
  const updateRatingsbyId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const Id = req.params.Id    
    const updates=req.body    
    const result = await updateReviewById(Id,updates, dbRepositoryHotel)    
    if (result) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: "  Successfully getted rating",
        result,
      })
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }



  return {
    registerHotel,
    registerRoom,
    registeredHotels,
    getHotelsUserSide,
    hotelDetails,
    hotelsFilter,
    DetailsFilter,
    checkAvilabitiy,
    listUnlistHotel,
    listUnlistRoom,
    addRating,
    getRatingsbyHotelId,
    getRatingsbyId,
    updateRatingsbyId,
    editHotel,
    addSaved,
    removeSaved,
    savedHotels,
    addOffer,
    removeOffer,
    editRoom
  }
}
export default hotelController
