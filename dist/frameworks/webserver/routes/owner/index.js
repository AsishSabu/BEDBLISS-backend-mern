"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const hotelDbInterface_1 = require("./../../../../app/interfaces/hotelDbInterface");
const express_1 = require("express");
const hotelRepositoryMongoDB_1 = require("../../../database/repositories/hotelRepositoryMongoDB");
const hotelController_1 = __importDefault(require("../../../../adapters/hotelController/hotelController"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const bookingDbInterface_1 = __importDefault(require("../../../../app/interfaces/bookingDbInterface"));
const bookingRepositoryMongoDB_1 = __importDefault(require("../../../database/repositories/bookingRepositoryMongoDB"));
const hotelServices_1 = require("../../../../app/service-interface/hotelServices");
const hotelServices_2 = require("../../../services/hotelServices");
const userDbInterfaces_1 = require("../../../../app/interfaces/userDbInterfaces");
const userRepostoryMongoDB_1 = require("../../../database/repositories/userRepostoryMongoDB");
const bookingController_1 = __importDefault(require("../../../../adapters/BookingController/bookingController"));
const bookingServices_1 = require("../../../../app/service-interface/bookingServices");
const bookingService_1 = require("../../../services/bookingService");
const chatDbInterface_1 = require("../../../../app/interfaces/chatDbInterface");
const chatRepositoryMongoDB_1 = __importDefault(require("../../../database/repositories/chatRepositoryMongoDB"));
const chatController_1 = __importDefault(require("../../../../adapters/chatController/chatController"));
const ownerRouter = () => {
    const router = (0, express_1.Router)();
    const controller = (0, hotelController_1.default)(hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository, bookingDbInterface_1.default, bookingRepositoryMongoDB_1.default);
    router.post("/addhotel", authMiddleware_1.default, controller.registerHotel);
    router.post("/addRoom/:id", authMiddleware_1.default, controller.registerRoom);
    router.get("/myHotels", authMiddleware_1.default, controller.registeredHotels);
    router.patch("/listUnlist/:id", authMiddleware_1.default, controller.listUnlistHotel);
    router.patch("/roomListUnlist/:id", authMiddleware_1.default, controller.listUnlistRoom);
    router.get("/hotelDetails/:id", authMiddleware_1.default, controller.hotelDetails);
    router.patch("/editHotel/:id", authMiddleware_1.default, controller.editHotel);
    router.patch("/addOffer/:id", authMiddleware_1.default, controller.addOffer);
    router.patch("/removeOffer/:id", authMiddleware_1.default, controller.removeOffer);
    router.patch("/editRoom/:id", authMiddleware_1.default, controller.editRoom);
    router.get("/getRatings/:hotelId", controller.getRatingsbyHotelId);
    router.patch("/updateRatingById/:Id", controller.updateRatingsbyId);
    const ownerBookingController = (0, bookingController_1.default)(bookingServices_1.bookingServiceInterface, bookingService_1.bookingService, bookingDbInterface_1.default, bookingRepositoryMongoDB_1.default, hotelDbInterface_1.hotelDbInterface, hotelRepositoryMongoDB_1.hotelDbRepository, hotelServices_1.hotelServiceInterface, hotelServices_2.hotelService, userDbInterfaces_1.userDbInterface, userRepostoryMongoDB_1.userDbRepository);
    router.get("/bookings", authMiddleware_1.default, ownerBookingController.getOwnerBookings);
    const ownerChatController = (0, chatController_1.default)(chatDbInterface_1.chatDbInterface, chatRepositoryMongoDB_1.default);
    router.get("/conversations", authMiddleware_1.default, ownerChatController.fetchChats);
    router.post("/chat", authMiddleware_1.default, ownerChatController.createNewChat);
    router.post("/messages", ownerChatController.createNewMessage);
    router.get("/messages/:id", ownerChatController.fetchMessages);
    return router;
};
exports.default = ownerRouter;
