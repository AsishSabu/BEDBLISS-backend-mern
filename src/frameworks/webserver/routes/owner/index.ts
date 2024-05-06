import express from "express";
// import authController from "../../../../adapters/ownerController/authController";
// import { ownerDbInterface } from "../../../../app/interfaces/ownerDbInterface";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { ownerDbRepository } from "../../../database/repositories/ownerRepository";
import { authService } from "../../../services/authService";

const ownerRouter = () => {
  const router = express.Router();

};
export default ownerRouter;
