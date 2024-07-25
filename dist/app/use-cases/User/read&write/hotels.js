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
exports.updateReviewById = exports.ReviewById = exports.ReviewsByUserId = exports.ratings = exports.addNewRating = exports.hotelDetailsFilter = exports.filterHotels = exports.getSaved = exports.removeFromSaved = exports.addToSaved = exports.getHotelDetails = exports.getUserHotels = void 0;
const rating_1 = __importDefault(require("../../../../entites/rating"));
const getUserHotels = (hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getUserHotels(); });
exports.getUserHotels = getUserHotels;
const getHotelDetails = (id, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getHotelDetails(id); });
exports.getHotelDetails = getHotelDetails;
const addToSaved = (userId, hotelId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.addSaved(userId, hotelId); });
exports.addToSaved = addToSaved;
const removeFromSaved = (userId, hotelId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.removeSaved(userId, hotelId); });
exports.removeFromSaved = removeFromSaved;
const getSaved = (userId, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.Saved(userId); });
exports.getSaved = getSaved;
const filterHotels = (destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, hotelRepository, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield hotelRepository.filterHotels(destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit);
    return data;
});
exports.filterHotels = filterHotels;
const hotelDetailsFilter = (id, adults, children, room, startDate, endDate, minPrice, maxPrice, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield hotelRepository.UserfilterHotelBYId(id, adults, children, room, startDate, endDate, minPrice, maxPrice);
    return data;
});
exports.hotelDetailsFilter = hotelDetailsFilter;
const addNewRating = (userId, ratingData, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    const { hotelId, rating, description, imageUrls } = ratingData;
    const newRatingEntity = (0, rating_1.default)(userId, hotelId, rating, description, imageUrls);
    return yield hotelRepository.addRating(newRatingEntity);
});
exports.addNewRating = addNewRating;
const ratings = (hotelID, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getRatings({ hotelId: hotelID }); });
exports.ratings = ratings;
const ReviewsByUserId = (userID, hotelID, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () {
    return yield hotelRepository.getRatings({
        userId: userID,
        hotelId: hotelID,
    });
});
exports.ReviewsByUserId = ReviewsByUserId;
const ReviewById = (id, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.getRatingById(id); });
exports.ReviewById = ReviewById;
const updateReviewById = (id, updates, hotelRepository) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelRepository.updateRatings(id, updates); });
exports.updateReviewById = updateReviewById;
