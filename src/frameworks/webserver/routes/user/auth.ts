import express from "express"
import { userDbInterface } from "../../../../app/interfaces/userDbInterfaces"
import { authServiceInterface } from "../../../../app/service-interface/authServices"
import { userDbRepository } from "../../../database/repositories/userRepostoryMongoDB"
import profileController from "../../../../adapters/userController/profileController"
import authController from "../../../../adapters/roleBasedController.ts/authController"
import { hotelDbInterface } from "../../../../app/interfaces/hotelDbInterface"
import { hotelDbRepository } from "../../../database/repositories/hotelRepositoryMongoDB"
import hotelController from "../../../../adapters/hotelController/hotelController"
import authenticateUser from "./../../middlewares/authMiddleware"
import { authService } from "../../../services/authservice"
import bookingDbInterface from "../../../../app/interfaces/bookingDbInterface"
import bookingDbRepository from "../../../database/repositories/bookingRepositoryMongoDB"
import { hotelServiceInterface } from "../../../../app/service-interface/hotelServices"
import { hotelService } from "../../../services/hotelServices"
import bookingController from "../../../../adapters/BookingController/bookingController"
import { bookingServiceInterface } from "../../../../app/service-interface/bookingServices"
import { bookingService } from "../../../services/bookingService"
import { chatDbInterface } from "../../../../app/interfaces/chatDbInterface"
import chatDbRepository from "../../../database/repositories/chatRepositoryMongoDB"
import chatController from "../../../../adapters/chatController/chatController"

const authRouter = () => {
  const router = express.Router()
  const authenticationController = authController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  )

  router.post("/auth/register", authenticationController.registerUser)

  router.post("/auth/login", authenticationController.userLogin)

  router.post("/auth/verifyOtp", authenticationController.verifyOtp)

  router.post("/auth/resendOtp", authenticationController.resendOtp)

  router.post(
    "/auth/googleAndFacebookSignIn",
    authenticationController.GoogleAndFacebbokSignIn
  )

  router.post("/auth/forgot-password", authenticationController.forgotPassword)

  router.post(
    "/auth/reset_password/:token",
    authenticationController.resetPassword
  )
  const userProfileController = profileController(
    authServiceInterface,
    authService,
    userDbInterface,
    userDbRepository
  )
  router.patch("/user/:id", userProfileController.getUser)
  router.get("/user/:id", userProfileController.getUserById)
  router.get("/profile", authenticateUser, userProfileController.userProfile)
  router.patch(
    "/addNotification/:id",
    authenticateUser,
    userProfileController.addNotification
  )
  router.patch(
    "/deleteNotification/:id",
    authenticateUser,
    userProfileController.deleteNotification
  )
  router.patch(
    "/markAsRead/:id",
    authenticateUser,
    userProfileController.markAsRead
  )
  router.patch(
    "/markAllAsRead",
    authenticateUser,
    userProfileController.markAllAsRead
  )
  router.patch(
    "/clearAllRead",
    authenticateUser,
    userProfileController.clearAllRead
  )

  router.patch(
    "/profile/edit",
    authenticateUser,
    userProfileController.updateProfile
  )
  router.post("/auth/verify", userProfileController.verifyPhoneNumber)
  router.get("/wallet", authenticateUser, userProfileController.transactions)

  const userHotelController = hotelController(
    hotelDbInterface,
    hotelDbRepository
  )
  router.get("/hotels", userHotelController.getHotelsUserSide)
  router.get("/searchedHotels", userHotelController.hotelsFilter)
  router.get("/hotelDetails", userHotelController.DetailsFilter)
  router.get("/hotelDetails/:id", userHotelController.hotelDetails)
  router.post("/checkAvailability/:id", userHotelController.checkAvilabitiy)
  router.post("/addRating", authenticateUser, userHotelController.addRating)
  router.get("/getRating/:hotelId", userHotelController.getRatingsbyHotelId)
  router.get("/getRatingById/:Id", userHotelController.getRatingsbyId)
  router.patch("/updateRatingById/:Id", userHotelController.updateRatingsbyId)
  router.patch(
    "/addRemoveSaved/:id",
    authenticateUser,
    userHotelController.addSaved
  )
  router.patch(
    "/removeSaved/:id",
    authenticateUser,
    userHotelController.removeSaved
  )
  router.get("/saved", authenticateUser, userHotelController.savedHotels)

  const userBookingController = bookingController(
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
  )

  router.post("/bookNow", authenticateUser, userBookingController.handleBooking)
  router.patch(
    "/payment/status/:id",
    authenticateUser,
    userBookingController.updatePaymentStatus
  )
  router.get("/bookings", authenticateUser, userBookingController.getBooking)
  router.get(
    "/bookingDetails/:id",
    authenticateUser,
    userBookingController.getBookingById
  )

  router.post(
    "/addUnavilableDates",
    authenticateUser,
    userBookingController.addUnavilableDate
  )

  router.get(
    "/bookingDetailsByBookingId/:id",
    authenticateUser,
    userBookingController.getByBookingId
  )
  router.patch(
    "/booking/cancel/:bookingID",
    authenticateUser,
    userBookingController.cancelBooking
  )
  router.patch(
    "/booking/update/:bookingID",
    authenticateUser,
    userBookingController.updateBooking
  )
  router.post("/addReporting/:userId", userBookingController.addReporting)

  const userChatController = chatController(chatDbInterface, chatDbRepository)

  //  router.get("/conversation/:id", userChatController.getConversation);
  router.get("/conversations", userChatController.fetchConversation)
  router.post("/chat", userChatController.createUserChat)

  router.post("/messages", userChatController.createNewMessage)
  router.get("/messages/:id", userChatController.fetchMessages)

  return router
}
export default authRouter
