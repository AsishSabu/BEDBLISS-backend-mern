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
exports.offerRemove = exports.offerUpdate = exports.roomUpdate = exports.hotelUpdate = exports.getMyHotels = exports.getHotels = exports.addRoom = exports.addHotel = void 0;
const hotel_1 = __importDefault(require("../../../entites/hotel"));
const httpStatus_1 = require("../../../types/httpStatus");
const appError_1 = __importDefault(require("../../../utils/appError"));
const room_1 = __importDefault(require("../../../entites/room"));
const addHotel = (ownerId, hotel, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(ownerId, "owner");
    const { name, destination, stayType, description, propertyRules, amenities, imageUrls, 
    // coordinates,
    address, hotelDocument, ownerPhoto, } = hotel;
    console.log(hotel, "hotel");
    const existingHotel = yield hotelRepository.getHotelByName(name);
    if (existingHotel) {
        throw new appError_1.default("Hotel with this name already exists", httpStatus_1.HttpStatus.UNAUTHORIZED);
    }
    const ownerDocument = "";
    const hotelEntity = (0, hotel_1.default)(ownerId, name, destination, stayType, description, propertyRules, amenities, imageUrls, 
    // coordinates,
    address, ownerDocument, hotelDocument, ownerPhoto);
    const newHotel = yield hotelRepository.addHotel(hotelEntity);
    return newHotel;
});
exports.addHotel = addHotel;
const addRoom = (hotelId, hotel, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(hotelId, "hotel");
    const { title, price, desc, maxChildren, maxAdults, roomNumbers } = hotel;
    // Correctly map the roomNumbers array
    const formattedRoomNumbers = roomNumbers.map((num) => ({
        number: num,
        unavailableDates: []
    }));
    console.log(formattedRoomNumbers, "formattedRoomNumbers");
    const roomEntity = (0, room_1.default)(title, price, desc, maxChildren, maxAdults, formattedRoomNumbers);
    const newHotel = yield hotelRepository.addRoom(roomEntity, hotelId);
    return newHotel;
});
exports.addRoom = addRoom;
const getHotels = (hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getAllHotels(); });
exports.getHotels = getHotels;
const getMyHotels = (ownerId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getMyHotels(ownerId); });
exports.getMyHotels = getMyHotels;
const hotelUpdate = (hotelId, updates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.updateHotel(hotelId, updates); });
exports.hotelUpdate = hotelUpdate;
const roomUpdate = (roomId, updates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.updateRoom(roomId, updates); });
exports.roomUpdate = roomUpdate;
const offerUpdate = (hotelId, updates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.offerUpdate(hotelId, updates); });
exports.offerUpdate = offerUpdate;
const offerRemove = (hotelId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.offerRemove(hotelId); });
exports.offerRemove = offerRemove;
