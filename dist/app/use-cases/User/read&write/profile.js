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
exports.clearAllReadNotification = exports.markAllAsReadNotification = exports.markAsReadNotification = exports.removeNotification = exports.AddNotification = exports.verifyNumber = exports.updateUser = exports.getUserProfile = void 0;
const getUserProfile = (userID, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.getUserById(userID);
    return user;
});
exports.getUserProfile = getUserProfile;
const updateUser = (userID, updateData, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.updateProfile(userID, updateData); });
exports.updateUser = updateUser;
const verifyNumber = (phoneNumber, userRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.getUserByNumber(phoneNumber);
    console.log(user);
});
exports.verifyNumber = verifyNumber;
const AddNotification = (id, notification, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.addNotifications(id, notification); });
exports.AddNotification = AddNotification;
const removeNotification = (userId, notificationId, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.removeNotifications(userId, notificationId); });
exports.removeNotification = removeNotification;
const markAsReadNotification = (userId, notificationId, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.markAsRead(userId, notificationId); });
exports.markAsReadNotification = markAsReadNotification;
const markAllAsReadNotification = (userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.markAllAsRead(userId); });
exports.markAllAsReadNotification = markAllAsReadNotification;
const clearAllReadNotification = (userId, userRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userRepository.clearReadNotifications(userId); });
exports.clearAllReadNotification = clearAllReadNotification;
