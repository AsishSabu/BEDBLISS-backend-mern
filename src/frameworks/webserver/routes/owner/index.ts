import { hotelDbInterface } from "./../../../../app/interfaces/hotelDbInterface";
import { Router } from "express";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import hotelController from "../../../../adapters/hotelController/hotelController";

const ownerRouter = () => {
  const router = Router();

  const controller = hotelController(hotelDbInterface, hotelDbRepository);

  router.post("/addhotel", controller.registerHotel);
  return router;
};
export default ownerRouter;
