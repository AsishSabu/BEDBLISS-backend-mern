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
exports.hotelDbInterface = void 0;
const hotelDbInterface = (repository) => {
    const addHotel = (hotel) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addHotel(hotel); });
    const addRoom = (hotel, hotelId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addRoom(hotel, hotelId); });
    const addSaved = (userId, hotelId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addOrRemoveFromSaved(userId, hotelId); });
    const removeSaved = (userId, hotelId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeFromSaved(userId, hotelId); });
    const Saved = (userId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getSavedHotels(userId); });
    const addStayType = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addStayType(name); });
    const StayTypeById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.StayTypeById(id); });
    const StayTypeByName = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.StayTypeByName(name); });
    const StayTypes = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.allStayTypes(); });
    const updateStayType = (id, data) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateStayType(id, data); });
    const getHotelById = (Id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelById(Id); });
    const getHotelByName = (name) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelByName(name); });
    const getHotelByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelEmail(email); });
    const getAllHotels = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getAllHotels(); });
    const getUserHotels = () => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getUserHotels(); });
    const getMyHotels = (ownerId) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getMyHotels(ownerId); });
    const getHotelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getHotelDetails(id); });
    const updateHotelBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateHotelBlock(id, status); });
    const updateHotel = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.update(id, updates); });
    const updateRoom = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateRoom(id, updates); });
    const offerUpdate = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateOffer(id, updates); });
    const offerRemove = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeOffer(id); });
    const removeHotel = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.remove(id); });
    const filterHotels = (destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.filterHotels(destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit);
    });
    const UserfilterHotelBYId = (id, adults, children, room, startDate, endDate, minPrice, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
        return yield repository.UserfilterHotelBYId(id, adults, children, room, startDate, endDate, minPrice, maxPrice);
    });
    const updateHotelVerified = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateHotelVerified(id); });
    const updateUnavailableDates = (id, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateUnavailableDates(id, dates); });
    const checkAvailability = (id, count, checkInDate, checkOutDate) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.checkAvailability(id, count, checkInDate, checkOutDate); });
    const addUnavilableDates = (room, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addUnavilableDates(room, dates); });
    const removeUnavailableDates = (room, dates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.removeUnavailableDates(room, dates); });
    const addRating = (ratingData) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.addRating(ratingData); });
    const getRatings = (filter) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getRatings(filter); });
    const getRatingById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.getRatingById(id); });
    const updateRatings = (id, updates) => __awaiter(void 0, void 0, void 0, function* () { return yield repository.updateRatingById(id, updates); });
    return {
        addHotel,
        addRoom,
        addStayType,
        StayTypeById,
        StayTypeByName,
        StayTypes,
        updateStayType,
        getHotelByName,
        getHotelByEmail,
        getAllHotels,
        getMyHotels,
        getUserHotels,
        getHotelDetails,
        getHotelById,
        updateHotelBlock,
        updateHotel,
        removeHotel,
        filterHotels,
        UserfilterHotelBYId,
        updateHotelVerified,
        updateUnavailableDates,
        checkAvailability,
        addUnavilableDates,
        removeUnavailableDates,
        addRating,
        getRatings,
        getRatingById,
        updateRatings,
        addSaved,
        removeSaved,
        updateRoom,
        Saved,
        offerUpdate,
        offerRemove,
    };
};
exports.hotelDbInterface = hotelDbInterface;
