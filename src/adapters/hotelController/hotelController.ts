import { hotelDbRepositoryType } from "./../../frameworks/database/repositories/hotelRepositoryMongoDB"
import { Request, Response, NextFunction } from "express"
import { addHotel, getMyHotels } from "../../app/use-cases/Owner/hotel"
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface"
import { HttpStatus } from "../../types/httpStatus"
import {
  getHotelDetails,
  getUserHotels,
  viewByDestination,
} from "../../app/use-cases/User/read&write/hotels"
import mongoose from "mongoose"

const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl())
  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId =  new mongoose.Types.ObjectId(req.user)
      console.log(ownerId);
      
      console.log(req.body)

      const hotelData = req.body
      console.log(hotelData)
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
      console.log(Hotels)

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
      console.log(id)

      const Hotel = await getHotelDetails(id, dbRepositoryHotel)
      console.log(Hotel)
      return res.status(HttpStatus.OK).json({ success: true, Hotel })
    } catch (error) {
      next(error)
    }
  }

  const destinationSearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { destination} = req.query
      console.log(destination,'/////////////////////////////////////////////////////////////////////////////////////////////////');
      if (typeof destination !== 'string') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 'fail',
          message: 'Invalid destination parameter',
        });
      }

      
      const data = await viewByDestination(destination, dbRepositoryHotel)
      console.log(data);
      

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "search result has been fetched",
        data: data,
      })
    } catch (error) {
      next(error)
    }
  }
  return {
    registerHotel,
    registeredHotels,
    getHotelsUserSide,
    hotelDetails,
    destinationSearch,
  }
}
export default hotelController
