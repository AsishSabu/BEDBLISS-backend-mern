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
exports.userDbRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpModel_1 = __importDefault(require("../models/otpModel"));
const transaction_1 = __importDefault(require("../models/transaction"));
const userModel_1 = __importDefault(require("../models/userModel"));
const wallet_1 = __importDefault(require("../models/wallet"));
const userDbRepository = () => {
    //get user by email
    const getUserEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ email });
        return user;
    });
    const getUserbyId = (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        try {
            const userDoc = yield userModel_1.default.findById(id).populate("wallet").lean();
            if (!userDoc) {
                return null;
            }
            // Transform notifications
            const transformedNotifications = userDoc.notifications.map((notification) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
                return ({
                    _id: (_a = notification._id) !== null && _a !== void 0 ? _a : "",
                    type: (_b = notification.type) !== null && _b !== void 0 ? _b : "",
                    message: (_c = notification.message) !== null && _c !== void 0 ? _c : "",
                    data: {
                        senderId: (_e = (_d = notification.data) === null || _d === void 0 ? void 0 : _d.senderId) !== null && _e !== void 0 ? _e : new mongoose_1.default.Types.ObjectId(),
                        name: (_g = (_f = notification.data) === null || _f === void 0 ? void 0 : _f.name) !== null && _g !== void 0 ? _g : "",
                        image: (_j = (_h = notification.data) === null || _h === void 0 ? void 0 : _h.image) !== null && _j !== void 0 ? _j : "",
                        onClickPath: (_l = (_k = notification.data) === null || _k === void 0 ? void 0 : _k.onClickPath) !== null && _l !== void 0 ? _l : "",
                    },
                    read: (_m = notification.read) !== null && _m !== void 0 ? _m : false,
                    createdAt: (_o = notification.createdAt) !== null && _o !== void 0 ? _o : new Date(),
                });
            });
            // Transform the user to ensure all fields are properly typed
            const transformedUser = {
                id: userDoc._id.toString(), // Convert `_id` to `id`
                name: (_a = userDoc.name) !== null && _a !== void 0 ? _a : "", // Ensure name is a string
                email: (_b = userDoc.email) !== null && _b !== void 0 ? _b : "",
                phoneNumber: (_c = userDoc.phoneNumber) !== null && _c !== void 0 ? _c : undefined,
                dob: (_d = userDoc.dob) !== null && _d !== void 0 ? _d : undefined,
                state: (_e = userDoc.state) !== null && _e !== void 0 ? _e : undefined,
                country: (_f = userDoc.country) !== null && _f !== void 0 ? _f : undefined,
                password: (_g = userDoc.password) !== null && _g !== void 0 ? _g : "",
                profilePic: (_h = userDoc.profilePic) !== null && _h !== void 0 ? _h : "", // Ensure profilePic is a string
                role: (_j = userDoc.role) !== null && _j !== void 0 ? _j : "user", // Ensure role is a string
                isVerified: (_k = userDoc.isVerified) !== null && _k !== void 0 ? _k : false,
                isBlocked: (_l = userDoc.isBlocked) !== null && _l !== void 0 ? _l : false,
                wallet: (_m = userDoc.wallet) !== null && _m !== void 0 ? _m : undefined,
                notifications: transformedNotifications,
                createdAt: (_o = userDoc.createdAt) !== null && _o !== void 0 ? _o : new Date(),
                updatedAt: (_p = userDoc.updatedAt) !== null && _p !== void 0 ? _p : new Date(),
                verificationCode: (_q = userDoc.verificationCode) !== null && _q !== void 0 ? _q : undefined,
            };
            return transformedUser;
        }
        catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    });
    //add user
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new userModel_1.default({
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getUserRole(),
        });
        newUser.save();
        return newUser;
    });
    // ada otp
    const addOtp = (otp, userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield otpModel_1.default.create({ otp, userId });
    });
    const findUserOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.findOne({ userId }); });
    const deleteUserOtp = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield otpModel_1.default.deleteOne({ userId }); });
    const updateUserVerified = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel_1.default.findOneAndUpdate({ _id: userId }, { isVerified: true });
    });
    const registerGoogleFacebookSignedUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.create({
            name: user.name(),
            email: user.email(),
            profilePic: user.picture(),
            isVerified: user.email_verified(),
            role: user.getUserRole(),
        });
    });
    const findVerificationCodeAndUpdate = (code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
        return yield userModel_1.default.findOneAndUpdate({ verificationCode: code }, { password: newPassword, verificationCode: null }, { upsert: true });
    });
    const updateVerificationCode = (email, code) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findOneAndUpdate({ email }, { verificationCode: code }); });
    const changeUserRole = (id, newRole) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Changing role to: ${newRole}`);
        try {
            const updatedUser = yield userModel_1.default.findOneAndUpdate({ _id: id }, { role: newRole }, { new: true } // This option returns the updated document
            );
            if (!updatedUser) {
                console.log("User not found");
                return null;
            }
            console.log("Role updated successfully:", updatedUser);
            return updatedUser;
        }
        catch (error) {
            console.error("Error updating role:", error);
            throw error;
        }
    });
    const updateUserInfo = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findByIdAndUpdate(id, updateData, { new: true }); });
    const getUserByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield userModel_1.default.findOne({ phoneNumber });
        return user;
    });
    const getAllUsers = (role) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield userModel_1.default.find({ isVerified: true, role: role }).sort({
            updatedAt: -1,
        });
        const allUsers = yield userModel_1.default.find({ role: role });
        const count = allUsers.length;
        return { users, count };
    });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield userModel_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const addWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield wallet_1.default.create({ userId }); });
    const updateWallet = (userId, newBalance) => __awaiter(void 0, void 0, void 0, function* () {
        return yield wallet_1.default.findOneAndUpdate({ userId }, { $inc: { balance: newBalance } }, { new: true });
    });
    const getWalletByUseId = (Id) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(Id);
        return yield wallet_1.default.findOne({ userId: Id });
    });
    const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () {
        return yield transaction_1.default.create({
            walletId: transactionDetails.getWalletId(),
            type: transactionDetails.getType(),
            description: transactionDetails.getDescription(),
            amount: transactionDetails.getAmount(),
        });
    });
    const allTransactions = (walletId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield transaction_1.default
            .find({ walletId })
            .sort({ createdAt: -1 })
            .populate("walletId");
    });
    const addNotifications = (id, notification) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const receiver = yield userModel_1.default.findById(id).sort({ createdAt: 1 });
            if (!receiver) {
                throw new Error("User not found");
            }
            receiver.notifications.push(notification);
            yield receiver.save();
            return receiver;
        }
        catch (error) {
            console.error("Error adding notification:", error);
            throw error;
        }
    });
    const deleteNotification = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const notification = user.notifications.id(notificationId);
            if (!notification) {
                throw new Error("Notification not found");
            }
            user.notifications.pull({ _id: notificationId });
            yield user.save();
            return user;
        }
        catch (error) {
            console.error("Error deleting notification:", error);
            throw error;
        }
    });
    const markNotificationAsRead = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const notification = user.notifications.id(notificationId);
            if (!notification) {
                throw new Error("Notification not found");
            }
            notification.read = true;
            yield user.save();
            return user;
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
            throw error;
        }
    });
    const markAllNotificationsAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.notifications.forEach(notification => {
                notification.read = true;
            });
            yield user.save();
            return user;
        }
        catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw error;
        }
    });
    const clearAllReadNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.notifications = user.notifications.filter(notification => !notification.read);
            yield user.save();
            return user;
        }
        catch (error) {
            console.error("Error clearing read notifications:", error);
            throw error;
        }
    });
    return {
        getUserEmail,
        addUser,
        addOtp,
        findUserOtp,
        deleteUserOtp,
        updateUserVerified,
        registerGoogleFacebookSignedUser,
        findVerificationCodeAndUpdate,
        updateVerificationCode,
        getUserbyId,
        updateUserInfo,
        getUserByNumber,
        getAllUsers,
        updateUserBlock,
        changeUserRole,
        updateWallet,
        createTransaction,
        getWalletByUseId,
        addWallet,
        allTransactions,
        addNotifications,
        deleteNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllReadNotifications,
    };
};
exports.userDbRepository = userDbRepository;
