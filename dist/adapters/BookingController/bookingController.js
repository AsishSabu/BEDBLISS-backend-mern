"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const booking_1 = __importStar(require("../../app/use-cases/Booking/booking"));
const httpStatus_1 = require("../../types/httpStatus");
const profile_1 = require("../../app/use-cases/User/read&write/profile");
const hotel_1 = require("../../app/use-cases/Owner/hotel");
function bookingController(bookingServiceInterface, bookingServiceImpl, bookingDbRepository, bookingDbRepositoryImp, hotelDbRepository, hotelDbRepositoryImpl, hotelServiceInterface, hotelServiceImpl, userDbRepository, userDbRepositoryImpl) {
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp());
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const hotelService = hotelServiceInterface(hotelServiceImpl());
    const bookingService = bookingServiceInterface(bookingServiceImpl());
    const handleBooking = (0, express_async_handler_1.default)((req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const bookingDetails = req.body;
            const userId = req.user;
            const data = yield (0, booking_1.default)(userId, bookingDetails, dbRepositoryBooking, dbRepositoryHotel, hotelService, dbRepositoryUser);
            if (data && data.paymentMethod === "Online") {
                const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
                if (typeof data.price === "number") {
                    const sessionId = yield (0, booking_1.makePayment)(user === null || user === void 0 ? void 0 : user.name, user === null || user === void 0 ? void 0 : user.email, data.bookingId, data.price);
                    res.status(httpStatus_1.HttpStatus.OK).json({
                        success: true,
                        message: "Booking created successfully",
                        id: sessionId,
                    });
                }
                else {
                    throw new Error("Invalid price for online payment");
                }
            }
            else if (data && data.paymentMethod === "Wallet") {
                const dates = yield (0, booking_1.addUnavilableDates)(data.rooms, (_a = data.checkInDate) !== null && _a !== void 0 ? _a : new Date(), (_b = data.checkOutDate) !== null && _b !== void 0 ? _b : new Date(), dbRepositoryHotel, hotelService);
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking created successfully using Wallet",
                    booking: data,
                });
            }
            else {
                const dates = yield (0, booking_1.addUnavilableDates)(data.rooms, (_c = data.checkInDate) !== null && _c !== void 0 ? _c : new Date(), (_d = data.checkOutDate) !== null && _d !== void 0 ? _d : new Date(), dbRepositoryHotel, hotelService);
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking created successfully ",
                    booking: data,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }));
    const updatePaymentStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { paymentStatus } = req.body;
            if (paymentStatus === "Failed") {
                const bookings = yield (0, booking_1.getBookingsBybookingId)(id, dbRepositoryBooking);
                if (bookings) {
                    const removedates = yield (0, booking_1.removeUnavilableDates)(bookings.rooms, bookings.checkInDate, bookings.checkOutDate, dbRepositoryHotel, hotelService);
                }
            }
            const result = yield (0, booking_1.updateBookingStatus)(id, paymentStatus, dbRepositoryBooking, dbRepositoryHotel, dbRepositoryUser);
            if (result) {
                res.status(httpStatus_1.HttpStatus.OK).json({
                    success: true,
                    message: "Booking status updated succesfully",
                    result,
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const getBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const bookings = yield (0, booking_1.getBookings)(userID, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getBookingById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ID = req.params.id;
            const bookings = yield (0, booking_1.getBookingsById)(ID, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const addUnavilableDate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _e, _f;
        const data = req.body;
        const result = yield (0, booking_1.addUnavilableDates)(data.rooms, (_e = data.checkInDate) !== null && _e !== void 0 ? _e : new Date(), (_f = data.checkOutDate) !== null && _f !== void 0 ? _f : new Date(), dbRepositoryHotel, hotelService);
        res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "dates added successfully",
            result,
        });
    });
    const getByBookingId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const ID = req.params.id;
            const bookings = yield (0, booking_1.getBookingsBybookingId)(ID, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const cancelBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _g, _h;
        try {
            const userID = req.user;
            const { reason, status } = req.body;
            const { bookingID } = req.params;
            const updateBooking = yield (0, booking_1.cancelBookingAndUpdateWallet)(userID, bookingID, status, reason, dbRepositoryBooking, dbRepositoryUser, bookingService);
            if (updateBooking) {
                const dates = yield (0, booking_1.removeUnavilableDates)(updateBooking.rooms, (_g = updateBooking.checkInDate) !== null && _g !== void 0 ? _g : new Date(), (_h = updateBooking.checkOutDate) !== null && _h !== void 0 ? _h : new Date(), dbRepositoryHotel, hotelService);
            }
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                booking: updateBooking,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const updateBooking = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const { reason, status } = req.body;
            const { bookingID } = req.params;
            const updateBooking = yield (0, booking_1.updateBookingDetails)(userID, status, reason, bookingID, dbRepositoryBooking, dbRepositoryUser);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Booking cancelled successfully",
                booking: updateBooking,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getOwnerBookings = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userID = req.user;
            const hotels = yield (0, hotel_1.getMyHotels)(userID, dbRepositoryHotel);
            const HotelIds = hotels.map(hotel => hotel._id.toString());
            const bookings = yield (0, booking_1.getBookingsByHotels)(HotelIds, dbRepositoryBooking);
            res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Bookings fetched successfully",
                bookings,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const addReporting = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const userId = req.params.userId;
        const data = req.body;
        const result = yield (0, booking_1.addNewReporting)(userId, data, dbRepositoryBooking);
        if (result) {
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "  Successfully added reporting" });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getReporting = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const Id = req.params.id;
        const result = yield (0, booking_1.reportingsByFilter)(Id, dbRepositoryBooking);
        if (result) {
            return (res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "  Successfully fetched reporting" }),
                result);
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    return {
        handleBooking,
        updatePaymentStatus,
        getBooking,
        getBookingById,
        cancelBooking,
        updateBooking,
        getOwnerBookings,
        addReporting,
        getByBookingId,
        addUnavilableDate,
        getReporting,
    };
}
exports.default = bookingController;
