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
Object.defineProperty(exports, "__esModule", { value: true });
const adminAuth_1 = require("./../../app/use-cases/Admin/auth/adminAuth");
const httpStatus_1 = require("../../types/httpStatus");
const adminRead_1 = require("../../app/use-cases/Admin/read&write/adminRead");
const adminUpdate_1 = require("../../app/use-cases/Admin/read&write/adminUpdate");
const hotel_1 = require("../../app/use-cases/Owner/hotel");
const booking_1 = require("../../app/use-cases/Booking/booking");
const adminController = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl, hotelDbRepository, hotelDbRepositoryImpl, bookingDbRepository, bookingDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl());
    const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImpl());
    const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const accessToken = yield (0, adminAuth_1.loginAdmin)(email, password, authService);
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Admin login success",
                admin: {
                    name: "Admin_User",
                    role: "admin",
                },
                accessToken,
            });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const role = "user";
            const { users } = yield (0, adminRead_1.getUsers)(role, dbRepositoryUser);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, users });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllOwners = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const role = "owner";
            const { users } = yield (0, adminRead_1.getUsers)(role, dbRepositoryUser);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, users });
        }
        catch (error) {
            next(error);
        }
    });
    const userBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, adminUpdate_1.blockUser)(id, dbRepositoryUser);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: "User blocked Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const getAllHotels = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { Hotels } = yield (0, hotel_1.getHotels)(dbRepositoryHotel);
            return res.status(httpStatus_1.HttpStatus.OK).json({ success: true, Hotels });
        }
        catch (error) {
            next(error);
        }
    });
    const CardCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = "user";
            const owner = "owner";
            const userCount = (yield (0, adminRead_1.getUsers)(user, dbRepositoryUser)).count;
            const ownerCount = (yield (0, adminRead_1.getUsers)(owner, dbRepositoryUser)).count;
            const hotelCount = (yield (0, hotel_1.getHotels)(dbRepositoryHotel)).count;
            console.log(ownerCount, "..........", userCount);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, userCount, hotelCount, ownerCount });
        }
        catch (error) {
            next(error);
        }
    });
    const hotelBlock = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, adminUpdate_1.blockHotel)(id, dbRepositoryHotel);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: " blocked Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const hotelVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield (0, adminUpdate_1.verifyHotel)(id, dbRepositoryHotel);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: " veified Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const rejectHotel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const updates = {
                isVerified: "rejected",
                Reason: reason,
            };
            yield (0, adminUpdate_1.updateHotel)(id, updates, dbRepositoryHotel);
            return res
                .status(httpStatus_1.HttpStatus.OK)
                .json({ success: true, message: " Rejected Successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const addCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name } = req.body; // Destructure name from req.body
            const existing = yield (0, adminRead_1.getStayTypeByName)(name, dbRepositoryHotel);
            if (existing.length) {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: "Stay type with this name already exists",
                });
            }
            const result = yield (0, adminUpdate_1.addStayType)(name, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "Stay Type added Successfully", result });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to add Stay Type" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const getAllCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield (0, adminRead_1.getAllstayTypes)(dbRepositoryHotel);
            if (data) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({
                    success: true,
                    message: "Stay Types fetched Successfully",
                    data,
                });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to fetch Stay Types" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const getCategoryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = yield (0, adminRead_1.getStayTypeById)(id, dbRepositoryHotel);
            if (data) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({
                    success: true,
                    message: "Stay Type fetched Successfully",
                    data,
                });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to fetch Stay Type" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const updateCategoryName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const { name } = req.body;
            const existing = yield (0, adminRead_1.getStayTypeByName)(name, dbRepositoryHotel);
            console.log(existing);
            if (existing.some(category => category._id.toString() !== id)) {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({
                    success: false,
                    message: "Stay type with this name already exists",
                });
            }
            const data = {
                name: name,
            };
            const result = yield (0, adminUpdate_1.updateStayType)(id, data, dbRepositoryHotel);
            console.log(result);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "Stay type updated successfully" });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to update stay type" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const categoryListing = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const data = yield (0, adminRead_1.getStayTypeById)(id, dbRepositoryHotel);
            const listing = { isListed: !(data === null || data === void 0 ? void 0 : data.isListed) };
            console.log(listing);
            const result = yield (0, adminUpdate_1.updateStayType)(id, listing, dbRepositoryHotel);
            if (result) {
                return res
                    .status(httpStatus_1.HttpStatus.OK)
                    .json({ success: true, message: "Stay type updated successfully", result });
            }
            else {
                return res
                    .status(httpStatus_1.HttpStatus.BAD_REQUEST)
                    .json({ success: false, message: "Failed to update stay type" });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const getBookings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, adminRead_1.getALLBookings)(dbRepositoryBooking);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted booking",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getReportings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, booking_1.reportings)(dbRepositoryBooking);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted reporting",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const getReportingsByFilter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.params.id;
        const result = yield (0, booking_1.reportingsByFilter)(id, dbRepositoryBooking);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully getted reporting",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    const updateReportings = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        console.log(data);
        const id = req.params.id;
        const result = yield (0, booking_1.updateReporting)(id, data, dbRepositoryBooking);
        if (result) {
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "  Successfully updated reporting",
                result,
            });
        }
        else {
            return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
        }
    });
    return {
        adminLogin,
        getAllUser,
        userBlock,
        getAllHotels,
        CardCount,
        hotelBlock,
        hotelVerify,
        rejectHotel,
        addCategory,
        getAllOwners,
        getReportings,
        getReportingsByFilter,
        updateReportings,
        getBookings,
        getAllCategories,
        getCategoryById,
        updateCategoryName,
        categoryListing,
    };
};
exports.default = adminController;
