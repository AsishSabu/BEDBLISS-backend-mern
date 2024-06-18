import { hotelDbInterface } from "./../../../../app/interfaces/hotelDbInterface";
import { Router } from "express";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import hotelController from "../../../../adapters/hotelController/hotelController";
import authenticateUser from "../../middlewares/authMiddleware";
import bookingDbInterface from "../../../../app/interfaces/bookingDbInterface";
import bookingDbRepository from "../../../database/repositories/bookingRepositoryMongoDB";
import { hotelServiceInterface } from "../../../../app/service-interface/hotelServices";
import { hotelService } from "../../../services/hotelServices";
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
import bookingController from "../../../../adapters/BookingController/bookingController";

const ownerRouter = () => {
  const router = Router();

  const controller = hotelController(hotelDbInterface, hotelDbRepository);

  router.post("/addhotel",authenticateUser,controller.registerHotel);
  router.post("/addRoom/:id",authenticateUser, controller.registerRoom);
  router.get("/myHotels",authenticateUser,controller.registeredHotels)
  router.get("/myHotels",authenticateUser,controller.registeredHotels)


  const ownerBookingController = bookingController(
    bookingDbInterface,
    bookingDbRepository,
    hotelDbInterface,
    hotelDbRepository,
    hotelServiceInterface,
    hotelService,
    userDbInterface,
    userDbRepository
   );
   router.get("/bookings",authenticateUser,ownerBookingController.getOwnerBookings)


  return router;
};
export default ownerRouter;
