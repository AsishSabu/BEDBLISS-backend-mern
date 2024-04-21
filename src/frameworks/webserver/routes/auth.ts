import express from "express";
import authController from "../../../adapters/authController/authController";
import { authServiceInterface } from "../../../app/service-interface/authServices";
import { authService } from "../../services/authservice";
import { userDbRepository } from "../../../app/interfaces/userDbRepositories";
import { userRepositoryMongoDb } from "../../database/repositories/userRepostoryMongoDB";

const authRouter = () => {
  const router = express.Router();
  const controller = authController(
    authServiceInterface,
    authService,
    userDbRepository,
    userRepositoryMongoDb
  );
  router.post("/signup", controller.registerUser);

  router.post("/login",controller.userLogin);

  router.post("/verify-otp",controller.verifyOtp)
 

  return router;
};
export default authRouter;
