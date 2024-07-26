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
import { bookingServiceInterface } from "../../../../app/service-interface/bookingServices";
import { bookingService } from "../../../services/bookingService";
import { chatDbInterface } from "../../../../app/interfaces/chatDbInterface";
import chatDbRepository from "../../../database/repositories/chatRepositoryMongoDB";
import chatController from "../../../../adapters/chatController/chatController";


const ownerRouter = () => {
  const router = Router();

  const controller = hotelController(hotelDbInterface, hotelDbRepository);

  router.post("/addhotel",authenticateUser,controller.registerHotel);
  router.post("/addRoom/:id",authenticateUser, controller.registerRoom);
  router.get("/myHotels",authenticateUser,controller.registeredHotels)
  router.patch("/listUnlist/:id",authenticateUser,controller.listUnlistHotel)
  router.patch("/roomListUnlist/:id",authenticateUser,controller.listUnlistRoom)
  router.get("/hotelDetails/:id",authenticateUser, controller.hotelDetails)
  router.patch("/editHotel/:id",authenticateUser, controller.editHotel)
  router.patch("/addOffer/:id",authenticateUser, controller.addOffer)
  router.patch("/removeOffer/:id",authenticateUser, controller.removeOffer)
  router.patch("/editRoom/:id",authenticateUser, controller.editRoom)
  // router.get("/myHotels",authenticateUser,controller.registeredHotels)


  const ownerBookingController = bookingController(
    bookingServiceInterface,
    bookingService,
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

   const ownerChatController=chatController(chatDbInterface,chatDbRepository)

  //  router.get("/conversation/:id", ownerChatController.getConversation);
   router.get("/conversations",authenticateUser, ownerChatController.fetchChats);
   router.post("/chat", authenticateUser,ownerChatController.createNewChat);
 
   router.post("/messages", ownerChatController.createNewMessage);
   router.get("/messages/:id", ownerChatController.fetchMessages);


  return router;
};
export default ownerRouter;
