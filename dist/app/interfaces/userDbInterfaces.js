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
exports.userDbInterface = void 0;
const userDbInterface = (repository) => {
    const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserEmail(email); });
    const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserbyId(id); });
    const addUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addUser(user); });
    const updateUserBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserBlock(id, status); });
    const addOtp = (otp, id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addOtp(otp, id); });
    const findOtpWithUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findUserOtp(userId); });
    const deleteOtpWithUser = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteUserOtp(userId); });
    const updateUserverification = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserVerified(userId); });
    const registerGooglefacebookoUser = (user) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.registerGoogleFacebookSignedUser(user); });
    const verifyAndResetPassword = (verificationCode, password) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.findVerificationCodeAndUpdate(verificationCode, password); });
    const updateVerificationCode = (email, verificationCode) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateVerificationCode(email, verificationCode); });
    const updateProfile = (userId, userData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUserInfo(userId, userData); });
    const getUserByNumber = (phoneNumber) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserByNumber(phoneNumber); });
    const getAllUsers = (role) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllUsers(role); });
    const changeUserRole = (id, role) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.changeUserRole(id, role); });
    const updateWallet = (userId, newBalance) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateWallet(userId, newBalance); });
    const createTransaction = (transactionDetails) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.createTransaction(transactionDetails); });
    const addWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addWallet(userId); });
    const getWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getWalletByUseId(userId); });
    const getTransaction = (walletId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.allTransactions(walletId); });
    const addNotifications = (Id, notification) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addNotifications(Id, notification); });
    const removeNotifications = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.deleteNotification(userId, notificationId); });
    const markAsRead = (userId, notificationId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.markNotificationAsRead(userId, notificationId); });
    const markAllAsRead = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.markAllNotificationsAsRead(userId); });
    const clearReadNotifications = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.clearAllReadNotifications(userId); });
    return {
        getUserByEmail,
        addUser,
        addOtp,
        findOtpWithUser,
        deleteOtpWithUser,
        updateUserverification,
        registerGooglefacebookoUser,
        verifyAndResetPassword,
        updateVerificationCode,
        getUserById,
        updateProfile,
        getUserByNumber,
        getAllUsers,
        updateUserBlock,
        changeUserRole,
        updateWallet,
        createTransaction,
        addWallet,
        getWallet,
        getTransaction,
        addNotifications,
        removeNotifications,
        markAsRead,
        markAllAsRead,
        clearReadNotifications
    };
};
exports.userDbInterface = userDbInterface;
