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
exports.getStayTypeByName = exports.getStayTypeById = exports.getAllstayTypes = exports.getALLBookings = exports.getUsers = void 0;
const getUsers = (role, userDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield userDbRepository.getAllUsers(role); });
exports.getUsers = getUsers;
const getALLBookings = (bookingRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield bookingRepository.getAllBooking(); });
exports.getALLBookings = getALLBookings;
const getAllstayTypes = (hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.StayTypes(); });
exports.getAllstayTypes = getAllstayTypes;
const getStayTypeById = (id, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.StayTypeById(id); });
exports.getStayTypeById = getStayTypeById;
const getStayTypeByName = (name, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.StayTypeByName(name); });
exports.getStayTypeByName = getStayTypeByName;
