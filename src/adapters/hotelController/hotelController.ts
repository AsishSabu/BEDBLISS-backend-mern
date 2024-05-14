import { hotelDbRepositoryType } from "./../../frameworks/database/repositories/hotelRepositoryMongoDB";
import { Request, Response, NextFunction } from "express";
import { addHotel } from "../../app/use-cases/Owner/hotel";
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";


const hotelController = (
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType
) => {
  const registerHotel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ownerId=req.user
      const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
      const hotelData = req.body;
      const registeredHotel = await addHotel(ownerId,hotelData, dbRepositoryHotel);
      res.json({
        status: "success",
        message: "hotel added suuccessfully",
        registeredHotel,
      });
    } catch (error) {
      next(error);
    }
  };
  return {
    registerHotel,
  };
};
export default hotelController;
