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
const hotel_1 = require("../../app/use-cases/Owner/hotel");
const httpStatus_1 = require("../../types/httpStatus");
const hotels_1 = require("../../app/use-cases/User/read&write/hotels");
const mongoose_1 = __importDefault(require("mongoose"));
const booking_1 = require("../../app/use-cases/Booking/booking");
const hotelController = (hotelDbRepository, hotelDbRepositoryImpl) => {
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const registerHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ownerId = new mongoose_1.default.Types.ObjectId(req.user);
            const hotelData = req.body;
            const registeredHotel = yield (0, hotel_1.addHotel)(ownerId, hotelData, dbRepositoryHotel);
            res.json({
                status: "success",
                message: "hotel added suuccessfully",
                registeredHotel,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const registerRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hotelId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const roomData = req.body;
            const registeredRoom = yield (0, hotel_1.addRoom)(hotelId, roomData, dbRepositoryHotel);
            res.json({
                status: "success",
                message: "room added suuccessfully",
                registeredRoom,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const addSaved = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const hotelId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const { updatedSavedEntry, message } = yield (0, hotels_1.addToSaved)(userId, hotelId, dbRepositoryHotel);
            res.json({
                status: "success",
                message,
                savedRoom: updatedSavedEntry,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const removeSaved = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const hotelId = new mongoose_1.default.Types.ObjectId(req.params.id);
            const savedRoom = yield (0, hotels_1.removeFromSaved)(userId, hotelId, dbRepositoryHotel);
            res.json({
                status: "success",
                message: "hotel removed from saved suuccessfully",
                savedRoom,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const savedHotels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const savedHotels = yield (0, hotels_1.getSaved)(userId, dbRepositoryHotel);
            res.json({
                status: "success",
                message: " saved hotels fetched succefully",
                savedHotels,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const registeredHotels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ownerId = req.user;
            const Hotels = yield (0, hotel_1.getMyHotels)(ownerId, dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
        }
        catch (error) {
            next(error);
        }
    });
    const getHotelsUserSide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Hotels } = yield (0, hotels_1.getUserHotels)(dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
        }
        catch (error) {
            next(error);
        }
    });
    const hotelDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const Hotel = yield (0, hotels_1.getHotelDetails)(id, dbRepositoryHotel);
            if (Hotel) {
                return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotel });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const hotelsFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const destination = req.query.destination;
            const adults = req.query.adult;
            const children = req.query.children;
            const room = req.query.room;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const amenities = req.query.amenities;
            const minPrice = req.query.minAmount;
            const maxPrice = req.query.maxAmount;
            const stayTypes = req.query.stayTypes;
            const page = parseInt(req.query.page) || 1;
            const limit = 4;
            const skip = (page - 1) * limit;
            const data = yield (0, hotels_1.filterHotels)(destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, stayTypes, dbRepositoryHotel, skip, limit);
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: "success",
                message: "search result has been fetched",
                data: data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const DetailsFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.query.id;
            const adults = req.query.adult;
            const children = req.query.children;
            const room = req.query.room;
            const startDate = req.query.startDate;
            const endDate = req.query.endDate;
            const minPrice = req.body.minPrice;
            const maxPrice = req.body.maxPrice;
            const data = yield (0, hotels_1.hotelDetailsFilter)(id, adults, children, room, startDate, endDate, minPrice, maxPrice, dbRepositoryHotel);
            res.status(httpStatus_1.HttpStatus.OK).json({
                status: "success",
                message: "Hotel details fetched",
                data,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const checkAvilabitiy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { dates, count } = req.body;
            const id = req.params.id;
            const RoomAvailable = yield (0, booking_1.checkAvailability)(id, count, dates, dbRepositoryHotel);
            if (RoomAvailable) {
                res.status(httpStatus_1.HttpStatus.OK).json({
                    status: "success",
                    message: "date is availble",
                    RoomAvailable,
                });
            }
            else {
                res.status(httpStatus_1.HttpStatus.OK).json({
                    status: "fail",
                    message: "date is unavailble",
                });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const listUnlistHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { value } = req.body;
            const updates = {
                isListed: value,
            };
            yield (0, hotel_1.hotelUpdate)(id, updates, dbRepositoryHotel);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "  Successfully updated" });
        }
        catch (error) {
            next(error);
        }
    });
    const listUnlistRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { value } = req.body;
            const updates = {
                listed: value,
            };
            const response = yield (0, hotel_1.roomUpdate)(id, updates, dbRepositoryHotel);
            if (response) {
                if (response.listed) {
                    return res
                        .status(httpStatus_1.HttpStatus.OK)
                        .json({ success: true, message: " Room listed Successfully " });
                }
                else {
                    return res
                        .status(httpStatus_1.HttpStatus.OK)
                        .json({ success: true, message: " Room Unlisted Successfully " });
                }
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const editRoom = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updates = req.body;
            const response = yield (0, hotel_1.roomUpdate)(id, updates, dbRepositoryHotel);
            if (response) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: " Room edited Successfully " });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const editHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield (0, hotel_1.hotelUpdate)(id, req.body, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: " hotel updated successfully " });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const addOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield (0, hotel_1.offerUpdate)(id, req.body, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "offer added Successfully " });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const removeOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const result = yield (0, hotel_1.offerRemove)(id, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: " offer removed Successfully" });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const addRating = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user;
        const data = req.body;
        const result = yield (0, hotels_1.addNewRating)(userId, data, dbRepositoryHotel);
        if (result) {
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "  Successfully added rating" });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getRatingsbyHotelId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const hotelId = req.params.hotelId;
        const result = yield (0, hotels_1.ratings)(hotelId, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getRatingsbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const Id = req.params.Id;
        const result = yield (0, hotels_1.ReviewById)(Id, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const updateRatingsbyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const Id = req.params.Id;
        const updates = req.body;
        const result = yield (0, hotels_1.updateReviewById)(Id, updates, dbRepositoryHotel);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted rating",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    return {
        registerHotel,
        registerRoom,
        registeredHotels,
        getHotelsUserSide,
        hotelDetails,
        hotelsFilter,
        DetailsFilter,
        checkAvilabitiy,
        listUnlistHotel,
        listUnlistRoom,
        addRating,
        getRatingsbyHotelId,
        getRatingsbyId,
        updateRatingsbyId,
        editHotel,
        addSaved,
        removeSaved,
        savedHotels,
        addOffer,
        removeOffer,
        editRoom
    };
};
exports.default = hotelController;
