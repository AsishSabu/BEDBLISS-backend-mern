"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userDbInterfaces_1 = require("../../../../app/interfaces/userDbInterfaces");
const authServices_1 = require("../../../../app/service-interface/authServices");
const userRepostoryMongoDB_1 = require("../../../database/repositories/userRepostoryMongoDB");
const profileController_1 = __importDefault(require("../../../../adapters/userController/profileController"));
const authController_1 = __importDefault(require("../../../../adapters/roleBasedController.ts/authController"));
const hotelDbInterface_1 = require("../../../../app/interfaces/hotelDbInterface");
const hotelRepositoryMongoDB_1 = require("../../../database/repositories/hotelRepositoryMongoDB");
const hotelController_1 = __importDefault(require("../../../../adapters/hotelController/hotelController"));
const authMiddleware_1 = __importDefault(require("./../../middlewares/authMiddleware"));
const authservice_1 = require("../../../services/authservice");
const bookingDbInterface_1 = __importDefault(require("../../../../app/interfaces/bookingDbInterface"));
const bookingRepositoryMongoDB_1 = __importDefault(require("../../../database/repositories/bookingRepositoryMongoDB"));
const hotelServices_1 = require("../../../../app/service-interface/hotelServices");
const hotelServices_2 = require("../../../services/hotelServices");
const bookingController_1 = __importDefault(require("../../../../adapters/BookingController/bookingController"));
const bookingServices_1 = require("../../../../app/service-interface/bookingServices");
const bookingService_1 = require("../../../services/bookingService");
const chatController_1 = __importDefault(require("../../../../adapters/ChatController/chatController"));
const chatDbInterface_1 = require("../../../../app/interfaces/chatDbInterface");
const chatRepositoryMongoDB_1 = __importDefault(require("../../../database/repositories/chatRepositoryMongoDB"));
const authRouter = () => {
    const router = express_1.default.Router();
    const authenticationController = (0, authController_1.default)(authServices_1.authServiceInterface, authservice_1.authService, userDbInterfaces_1.userDbInterface, userRepostoryMongoDB_1.userDbRepository);
    router.post("/auth/register", authenticationController.registerUser);
    router.post("/auth/login", authenticationController.userLogin);
    router.post("/auth/verifyOtp", authenticationController.verifyOtp);
    router.post("/auth/resendOtp", authenticationController.resendOtp);
    router.post("/auth/googleAndFacebookSignIn", authenticationController.GoogleAndFacebbokSignIn);
    router.post("/auth/forgot-password", authenticationController.forgotPassword);
    router.post("/auth/reset_password/:token", authenticationController.resetPassword);
    const userProfileController = (0, profileController_1.default)(authServices_1.authServiceInterface, authservice_1.authService, userDbInterfaces_1.userDbInterface, userRepostoryMongoDB_1.userDbRepository);
    router.patch("/user/:id", userProfileController.getUser);
    router.get("/user/:id", userProfileController.getUserById);
    router.get("/profile", authMiddleware_1.default, userProfileController.userProfile);
    router.patch("/addNotification/:id", authMiddleware_1.default, userProfileController.addNotification);
    router.patch("/deleteNotification/:id", authMiddleware_1.default, userProfileController.deleteNotification);
    router.patch("/markAsRead/:id", authMiddleware_1.default, userProfileController.markAsRead);
    router.patch("/markAllAsRead", authMiddleware_1.default, userProfileController.markAllAsRead);
    router.patch("/clearAllRead", authMiddleware_1.default, userProfileController.clearAllRead);
    router.patch("/profile/edit", authMiddleware_1.default, userProfileController.updateProfile);
    router.post("/auth/verify", userProfileController.verifyPhoneNumber);
    router.get("/wallet", authMiddleware_1.default, userProfileController.transactions);
    const userHotelController = (0, hotelController_1.default)(hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository);
    router.get("/hotels", userHotelController.getHotelsUserSide);
    router.get("/searchedHotels", userHotelController.hotelsFilter);
    router.get("/hotelDetails", userHotelController.DetailsFilter);
    router.get("/hotelDetails/:id", userHotelController.hotelDetails);
    router.post("/checkAvailability/:id", userHotelController.checkAvilabitiy);
    router.post("/addRating", authMiddleware_1.default, userHotelController.addRating);
    router.get("/getRating/:hotelId", userHotelController.getRatingsbyHotelId);
    router.get("/getRatingById/:Id", userHotelController.getRatingsbyId);
    router.patch("/updateRatingById/:Id", userHotelController.updateRatingsbyId);
    router.patch("/addRemoveSaved/:id", authMiddleware_1.default, userHotelController.addSaved);
    router.patch("/removeSaved/:id", authMiddleware_1.default, userHotelController.removeSaved);
    router.get("/saved", authMiddleware_1.default, userHotelController.savedHotels);
    const userBookingController = (0, bookingController_1.default)(bookingServices_1.bookingServiceInterface, bookingService_1.bookingService, bookingDbInterface_1.default, bookingRepositoryMongoDB_1.default, hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository, hotelServices_1.hotelServiceInterface, hotelServices_2.hotelService, userDbInterfaces_1.userDbInterface, userRepostoryMongoDB_1.userDbRepository);
    router.post("/bookNow", authMiddleware_1.default, userBookingController.handleBooking);
    router.patch("/payment/status/:id", authMiddleware_1.default, userBookingController.updatePaymentStatus);
    router.get("/bookings", authMiddleware_1.default, userBookingController.getBooking);
    router.get("/bookingDetails/:id", authMiddleware_1.default, userBookingController.getBookingById);
    router.post("/addUnavilableDates", authMiddleware_1.default, userBookingController.addUnavilableDate);
    router.get("/bookingDetailsByBookingId/:id", authMiddleware_1.default, userBookingController.getByBookingId);
    router.patch("/booking/cancel/:bookingID", authMiddleware_1.default, userBookingController.cancelBooking);
    router.patch("/booking/update/:bookingID", authMiddleware_1.default, userBookingController.updateBooking);
    router.post("/addReporting/:userId", userBookingController.addReporting);
    const userChatController = (0, chatController_1.default)(chatDbInterface_1.chatDbInterface, chatRepositoryMongoDB_1.default);
    //  router.get("/conversation/:id", userChatController.getConversation);
    router.get("/conversations", userChatController.fetchConversation);
    router.post("/chat", userChatController.createUserChat);
    router.post("/messages", userChatController.createNewMessage);
    router.get("/messages/:id", userChatController.fetchMessages);
    return router;
};
exports.default = authRouter;
