"use strict";
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
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const reportModel_1 = __importDefault(require("../models/reportModel"));
function bookingDbRepository() {
    const createBooking = (bookingEntity) => __awaiter(this, void 0, void 0, function* () {
        try {
            const data = new bookingModel_1.default({
                firstName: bookingEntity.getFirstName(),
                lastName: bookingEntity.getLastName(),
                phoneNumber: bookingEntity.getPhoneNumber(),
                email: bookingEntity.getEmail(),
                hotelId: bookingEntity.getHotelId(),
                userId: bookingEntity.getUserId(),
                maxAdults: bookingEntity.getMaxAdults(),
                maxChildren: bookingEntity.getMaxChildren(),
                checkInDate: bookingEntity.getCheckInDate(),
                checkOutDate: bookingEntity.getCheckOutDate(),
                totalDays: bookingEntity.getTotalDays(),
                totalRooms: bookingEntity.getTotalRooms(),
                price: bookingEntity.getPrice(),
                platformFee: bookingEntity.getPlatformFee(),
                rooms: bookingEntity.getRooms(),
                paymentMethod: bookingEntity.getPaymentMethod(),
            });
            yield data.save();
            return data;
        }
        catch (error) {
            throw new Error("Error creating booking");
        }
    });
    const getAllBooking = () => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find()
                .sort({ updatedAt: -1 })
                .populate("userId")
                .populate("hotelId");
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching all bookings");
        }
    });
    const getBookingById = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const booking = yield bookingModel_1.default.findById(id)
                .populate("userId") // Populate userId field
                .populate("hotelId") // Populate hotelId field
                .populate("hotelId.ownerId"); // Populate ownerId field of hotelId
            return booking;
        }
        catch (error) {
            console.error("Error fetching booking by ID:", error);
            throw new Error("Error fetching booking by ID");
        }
    });
    const getBookingBybookingId = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const booking = yield bookingModel_1.default.findOne({ bookingId: id })
                .populate("userId")
                .populate("hotelId")
                .populate("hotelId.ownerId");
            return booking;
        }
        catch (error) {
            throw new Error("Error fetching booking by booking ID");
        }
    });
    const getBookingByuser = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find({ userId: id })
                .populate("userId")
                .populate("hotelId")
                .populate("hotelId.ownerId")
                .sort({ createdAt: -1 });
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching bookings by user ID");
        }
    });
    const getBookingByHotel = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find({ hotelId: id })
                .populate("userId")
                .populate("hotelId")
                .populate("hotelId.ownerId");
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching bookings by hotel ID");
        }
    });
    const getBookingByHotels = (ids) => __awaiter(this, void 0, void 0, function* () {
        try {
            const bookings = yield bookingModel_1.default.find({ hotelId: { $in: ids } })
                .populate("userId")
                .populate("hotelId")
                .populate("hotelId.ownerId").sort({ createdAt: -1 });
            return bookings;
        }
        catch (error) {
            throw new Error("Error fetching bookings by hotel IDs");
        }
    });
    const deleteBooking = (id) => __awaiter(this, void 0, void 0, function* () {
        try {
            const deletedBooking = yield bookingModel_1.default.findByIdAndUpdate(id, { $set: { status: "cancelled" } }, { new: true });
            return deletedBooking;
        }
        catch (error) {
            throw new Error("Error deleting booking");
        }
    });
    const updateBooking = (bookingId, updatingData) => __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedBooking = yield bookingModel_1.default.findOneAndUpdate({ bookingId }, updatingData, { new: true, upsert: true }).populate({
                path: "hotelId",
                populate: {
                    path: "ownerId",
                },
            });
            return updatedBooking;
        }
        catch (error) {
            throw new Error("Error updating booking");
        }
    });
    const addReporting = (reportingData) => __awaiter(this, void 0, void 0, function* () {
        return yield reportModel_1.default.create({
            userId: reportingData.getUserId(),
            hotelId: reportingData.getHotelId(),
            bookingId: reportingData.getBookingId(),
            reason: reportingData.getReason(),
        });
    });
    const getReportings = () => __awaiter(this, void 0, void 0, function* () {
        return yield reportModel_1.default.find()
            .populate("userId")
            .populate("hotelId")
            .populate("bookingId");
    });
    const getReportingsByFilter = (id) => __awaiter(this, void 0, void 0, function* () {
        return yield reportModel_1.default.findById(id)
            .populate("userId")
            .populate("hotelId")
            .populate("bookingId");
    });
    const updateReporting = (reportingId, updatingData) => __awaiter(this, void 0, void 0, function* () {
        return yield reportModel_1.default.findByIdAndUpdate(reportingId, updatingData, {
            new: true,
            upsert: true,
        });
    });
    return {
        createBooking,
        getAllBooking,
        getBookingByuser,
        deleteBooking,
        updateBooking,
        getBookingById,
        getBookingByHotel,
        getBookingBybookingId,
        getBookingByHotels,
        addReporting,
        getReportings,
        getReportingsByFilter,
        updateReporting,
    };
}
exports.default = bookingDbRepository;
