import express from "express";
import authController from "../../../../adapters/userController/authController";
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
import { authService } from "../../../services/authService";
import authenticateUser from "../../middlewares/authMiddleware";
import profileController from "../../../../adapters/userController/profileController";

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

  router.post("/auth/googleSignIn", authenticationController.GoogleAndFacebbokSignIn);

  router.post("/auth/facebookSignIn", authenticationController.GoogleAndFacebbokSignIn);

  router.post("/auth/forgot-password", authenticationController.forgotPassword);

  router.post("/auth/reset_password/:token", authenticationController.resetPassword);




  const userProfileController=profileController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  )

  router.get("/profile", authenticateUser, userProfileController.userProfile);

  router.patch("/profile/edit", authenticateUser, userProfileController.updateProfile);
  router.post("/auth/verify", userProfileController.verifyPhoneNumber);


  return router;
};
export default authRouter;
