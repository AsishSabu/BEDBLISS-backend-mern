import express from "express";
import authController from "../../../../adapters/ownerController/authController";
import { ownerDbInterface } from "../../../../app/interfaces/ownerDbInterface";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { ownerDbRepository } from "../../../database/repositories/ownerRepository";
import { authService } from "../../../services/authService";
import { loginOwner } from "./../../../../app/use-cases/Owner/auth/ownerAuth";
const ownerRouter = () => {
  const router = express.Router();
  const controller = authController(
    authServiceInterface,
    authService,
    ownerDbInterface,
    ownerDbRepository
  );
  router.post("/auth/register", controller.registerUser);
  router.post("/auth/login", controller.ownerLogin);
  router.post("/auth/verifyOtp", controller.verifyOtp);
  router.post("/auth/resendOtp", controller.resendOtp);
  router.post("/auth/googleSignIn", controller.GoogleAndFacebbokSignIn);
  router.post("/auth/facebookSignIn", controller.GoogleAndFacebbokSignIn);
  return router;
};
export default ownerRouter;
