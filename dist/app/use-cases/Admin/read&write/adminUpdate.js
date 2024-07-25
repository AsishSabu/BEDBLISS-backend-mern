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
exports.updateStayType = exports.addStayType = exports.updateHotel = exports.verifyHotel = exports.blockHotel = exports.blockUser = void 0;
const blockUser = (id, userDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userDbRepository.getUserById(id);
    yield userDbRepository.updateUserBlock(id, !(user === null || user === void 0 ? void 0 : user.isBlocked));
});
exports.blockUser = blockUser;
const blockHotel = (id, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield hotelDbRepository.getHotelById(id);
    yield hotelDbRepository.updateHotelBlock(id, !(hotel === null || hotel === void 0 ? void 0 : hotel.isBlocked));
});
exports.blockHotel = blockHotel;
const verifyHotel = (id, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyHotel = yield hotelDbRepository.updateHotelVerified(id);
});
exports.verifyHotel = verifyHotel;
const updateHotel = (id, updates, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelDbRepository.updateHotel(id, updates); });
exports.updateHotel = updateHotel;
const addStayType = (name, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelDbRepository.addStayType(name); });
exports.addStayType = addStayType;
const updateStayType = (id, data, hotelDbRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelDbRepository.updateStayType(id, data); });
exports.updateStayType = updateStayType;
