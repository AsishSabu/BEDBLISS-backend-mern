import { hotelDbInterface } from "./../../../../app/interfaces/hotelDbInterface";
import { Router } from "express";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import hotelController from "../../../../adapters/hotelController/hotelController";
import authenticateUser from "../../middlewares/authMiddleware";

const ownerRouter = () => {
  const router = Router();

  const controller = hotelController(hotelDbInterface, hotelDbRepository);

  router.post("/addhotel",authenticateUser,controller.registerHotel);
  router.post("/addRoom/:id",authenticateUser, controller.registerRoom);
  router.get("/myHotels",authenticateUser,controller.registeredHotels)
  return router;
};
export default ownerRouter;
