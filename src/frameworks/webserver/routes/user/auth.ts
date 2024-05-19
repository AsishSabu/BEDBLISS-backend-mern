import express from "express";
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
import { authService } from "../../../services/authService";
import profileController from "../../../../adapters/userController/profileController";
import authController from "../../../../adapters/roleBasedController.ts/authController";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import hotelController from "../../../../adapters/hotelController/hotelController";
import authenticateUser from "./../../middlewares/authMiddleware";

const authRouter = () => {
  const router = express.Router();
  const authenticationController = authController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  );
  router.post("/auth/register", authenticationController.registerUser);

  router.post("/auth/login", authenticationController.userLogin);

  router.post("/auth/verifyOtp", authenticationController.verifyOtp);

  router.post("/auth/resendOtp", authenticationController.resendOtp);

  router.post(
    "/auth/googleAndFacebookSignIn",
    authenticationController.GoogleAndFacebbokSignIn
  );

  router.post("/auth/forgot-password", authenticationController.forgotPassword);

  router.post(
    "/auth/reset_password/:token",
    authenticationController.resetPassword
  );

  const userProfileController = profileController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  );

  router.get("/profile", authenticateUser, userProfileController.userProfile);

  router.patch(
    "/profile/edit",
    authenticateUser,
    userProfileController.updateProfile
  );
  router.post("/auth/verify", userProfileController.verifyPhoneNumber);

  const userHotelController = hotelController(
    hotelDbInterface,
    hotelDbRepository
  );
  router.get("/hotels", authenticateUser, userHotelController.getHotelsUserSide);

  return router;
};
export default authRouter;
