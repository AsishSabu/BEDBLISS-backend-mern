import { hotelDbRepositoryType } from "./../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { Request, Response, NextFunction } from "express";
import { addHotel, getMyHotels } from "../../app/use-cases/Owner/hotel";
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";
import { HttpStatus } from "../../types/httpStatus";
import { getUserHotels } from "../../app/use-cases/User/read&write/hotels";

const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user;
      console.log(req.body);

      const hotelData = req.body;
      const registeredHotel = await addHotel(
        ownerId,
        hotelData,
        dbRepositoryHotel
      );
      res.json({
        status: "success",
        message: "hotel added suuccessfully",
        registeredHotel,
      });
    } catch (error) {
      next(error);
    }
  };

  const registeredHotels = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId = req.user;
      const Hotels = await getMyHotels(ownerId,dbRepositoryHotel);
      return res.status(HttpStatus.OK).json({ success: true, Hotels });
    } catch (error) {
      next(error);
    }
  };

  const getHotelsUserSide=async(
    req:Request,
    res:Response,
    next:NextFunction,
  )=>{
    try {
      if(req.user){
        const Hotels=await getUserHotels(dbRepositoryHotel)
        return res.status(HttpStatus.OK).json({ success: true, Hotels });
      }
    } catch (error) {
      next(error)
    }
  }

  return {
    registerHotel,
    registeredHotels,
    getHotelsUserSide
  };
};
export default hotelController;
