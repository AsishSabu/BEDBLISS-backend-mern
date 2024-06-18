import express from "express";
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces";
import { authServiceInterface } from "../../../../app/service-interface/authServices";
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB";
import profileController from "../../../../adapters/userController/profileController";
import authController from "../../../../adapters/roleBasedController.ts/authController";
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface";
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB";
import hotelController from "../../../../adapters/hotelController/hotelController";
import authenticateUser from "./../../middlewares/authMiddleware";
import { authService } from "../../../services/authservice";
import bookingDbInterface from "../../../../app/interfaces/bookingDbInterface";
import bookingDbRepository from "../../../database/repositories/bookingRepositoryMongoDB";
import { hotelServiceInterface } from "../../../../app/service-interface/hotelServices";
import { hotelService } from "../../../services/hotelServices";
import bookingController from "../../../../adapters/BookingController/bookingController";

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
  // router.post("/changeRole",authenticateUser,authenticationController.roleSwitch)

  const userProfileController = profileController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  );
  router.get("/user/:id",userProfileController.getUser)
  router.get("/profile", authenticateUser, userProfileController.userProfile);

  router.patch(
    "/profile/edit",
    authenticateUser,
    userProfileController.updateProfile
  );
  router.post("/auth/verify", userProfileController.verifyPhoneNumber);
  router.get("/wallet",authenticateUser,userProfileController.transactions)

  const userHotelController = hotelController(
    hotelDbInterface,
    hotelDbRepository
  );
  router.get("/hotels",  userHotelController.getHotelsUserSide);
  router.get("/searchedHotels", userHotelController.destinationSearch)
  router.get("/hotelDetails/:id", userHotelController.hotelDetails);
  router.get("/checkAvailability/:id", userHotelController.checkAvilabitiy);

  const userBookingController = bookingController(
   bookingDbInterface,
   bookingDbRepository,
   hotelDbInterface,
   hotelDbRepository,
   hotelServiceInterface,
   hotelService,
   userDbInterface,
   userDbRepository
  );

  router.post("/bookNow",authenticateUser,userBookingController.handleBooking)
  router.patch("/payment/status/:id",authenticateUser,userBookingController.updatePaymentStatus)
  router.get("/bookings",authenticateUser,userBookingController.getBooking)
  router.get("/bookingDetails/:id",authenticateUser,userBookingController.getBookingById)
  router.patch("/booking/cancel/:bookingID",authenticateUser,userBookingController.cancelBooking)
  router.patch("/booking/accept/:bookingID",authenticateUser,userBookingController.approveBooking)



  return router;
};
export default authRouter;
