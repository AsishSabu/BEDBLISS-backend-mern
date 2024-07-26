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
const profile_1 = require("../../app/use-cases/User/read&write/profile");
const httpStatus_1 = require("../../types/httpStatus");
const booking_1 = require("../../app/use-cases/Booking/booking");
const profileController = (authServiceInterface, authServiceImpl, userDbRepository, userDbRepositoryImpl) => {
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const authService = authServiceInterface(authServiceImpl());
    const userProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const getUserById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const user = yield (0, profile_1.getUserProfile)(userId, dbRepositoryUser);
            res.status(200).json({ success: true, user });
        }
        catch (error) {
            next(error);
        }
    });
    const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const updatedData = req.body;
            const user = yield (0, profile_1.updateUser)(userId, updatedData, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const updatedData = req.body;
            const user = yield (0, profile_1.updateUser)(userId, updatedData, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, user, message: "Profile updated successfully" });
        }
        catch (error) {
            next(error);
        }
    });
    const verifyPhoneNumber = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { phone } = req.body;
        yield (0, profile_1.verifyNumber)(phone, dbRepositoryUser);
        return res.status(httpStatus_1.HttpStatus.OK).json({
            success: true,
            message: "otp is sended to your phone number",
        });
    });
    const transactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const transaction = yield (0, booking_1.getTransaction)(userId, dbRepositoryUser);
            res
                .status(200)
                .json({ success: true, transaction, message: "transactions" });
        }
        catch (error) {
            next(error);
        }
    });
    const addNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiverId = req.params.id;
            const data = req.body;
            const result = yield (0, profile_1.AddNotification)(receiverId, data, dbRepositoryUser);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "notification added succesfully",
                    result,
                });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const deleteNotification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const notificationId = req.params.id;
            const result = yield (0, profile_1.removeNotification)(userId, notificationId, dbRepositoryUser);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "notification removed succesfully",
                    result,
                });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const markAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.params.id;
            const { notificationId } = req.body;
            const result = yield (0, profile_1.markAsReadNotification)(userId, notificationId, dbRepositoryUser);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "mark as readed succesfully",
                    result,
                });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const markAllAsRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const result = yield (0, profile_1.markAllAsReadNotification)(userId, dbRepositoryUser);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "mark all as readed succesfully",
                    result,
                });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    const clearAllRead = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = req.user;
            const result = yield (0, profile_1.clearAllReadNotification)(userId, dbRepositoryUser);
            if (result) {
                res.status(200).json({
                    success: true,
                    message: "clear readed notifications",
                    result,
                });
            }
            else {
                return res.status(httpStatus_1.HttpStatus.NOT_FOUND).json({ success: false });
            }
        }
        catch (error) {
            next(error);
        }
    });
    return {
        userProfile,
        getUserById,
        updateProfile,
        verifyPhoneNumber,
        getUser,
        transactions,
        addNotification,
        deleteNotification,
        markAsRead,
        markAllAsRead,
        clearAllRead,
    };
};
exports.default = profileController;
