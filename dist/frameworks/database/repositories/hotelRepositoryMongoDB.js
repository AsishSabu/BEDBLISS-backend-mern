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
exports.hotelDbRepository = void 0;
const hotelModel_1 = __importDefault(require("../models/hotelModel"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const savedModel_1 = __importDefault(require("../models/savedModel"));
const hotelDbRepository = () => {
    const addHotel = (hotel) => __awaiter(void 0, void 0, void 0, function* () {
        const newHotel = new hotelModel_1.default({
            name: hotel.getName(),
            address: hotel.getAddress(),
            ownerId: hotel.getOwnerId(),
            destination: hotel.getDestination(),
            stayType: hotel.getStayType(),
            propertyRules: hotel.getPropertyRules(),
            description: hotel.getDescription(),
            amenities: hotel.getAmenities(),
            imageUrls: hotel.getImageUrls(),
            // coordinates: hotel.getCordinatesType(),
            ownerDocument: hotel.getOwnerDocument(),
            hotelDocument: hotel.getHotelDocument(),
            ownerPhoto: hotel.getOwnerPhoto(),
        });
        newHotel.save();
        return newHotel;
    });
    const addRoom = (room, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        const newRoom = new roomModel_1.default({
            title: room.getTitle(),
            price: room.getPrice(),
            maxChildren: room.getMaxChildren(),
            maxAdults: room.getMaxAdults(),
            desc: room.getDescription(),
            roomNumbers: room.getRoomNumbers(),
        });
        try {
            const savedRoom = yield newRoom.save();
            try {
                yield hotelModel_1.default.findByIdAndUpdate(hotelId, {
                    $push: { rooms: savedRoom._id },
                });
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log(error);
        }
        return newRoom;
    });
    const getSavedHotels = (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedHotels = yield savedModel_1.default.aggregate([
                { $match: { userId: new mongoose_1.default.Types.ObjectId(id) } },
                { $unwind: "$Hotels" },
                {
                    $lookup: {
                        from: "hotels",
                        localField: "Hotels",
                        foreignField: "_id",
                        as: "hotelDetails",
                    },
                },
                { $unwind: "$hotelDetails" },
                {
                    $match: {
                        "hotelDetails.isVerified": "verified",
                        "hotelDetails.isListed": true,
                        "hotelDetails.isBlocked": false,
                    },
                },
                {
                    $group: {
                        _id: "$_id",
                        Hotels: { $push: "$hotelDetails" },
                    },
                },
            ]);
            // If there are saved hotels, return the Hotels array, otherwise return an empty array
            return savedHotels.length > 0 ? savedHotels[0].Hotels : [];
        }
        catch (error) {
            console.error("Error fetching verified saved hotels:", error);
            throw error;
        }
    });
    const addOrRemoveFromSaved = (id, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedEntry = yield savedModel_1.default.findOne({ userId: id });
            let message = "";
            if (savedEntry) {
                const hotelIndex = savedEntry.Hotels.indexOf(hotelId);
                if (hotelIndex === -1) {
                    // Hotel is not in the list, add it
                    savedEntry.Hotels.push(hotelId);
                    message = "Hotel added to saved list";
                }
                else {
                    // Hotel is in the list, remove it
                    savedEntry.Hotels.splice(hotelIndex, 1);
                    message = "Hotel removed from saved list";
                }
                yield savedEntry.save();
            }
            else {
                // No saved entry found, create a new one and add the hotel
                const newSavedEntry = new savedModel_1.default({
                    userId: id,
                    Hotels: [hotelId],
                });
                yield newSavedEntry.save();
                console.log("New saved list created and hotel added");
            }
            const updatedSavedEntry = yield savedModel_1.default.findOne({ userId: id }).populate("Hotels");
            return { updatedSavedEntry, message };
        }
        catch (error) {
            console.error("Error updating saved list:", error);
            throw error;
        }
    });
    const removeFromSaved = (id, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const savedEntry = yield savedModel_1.default.findOne({ userId: id });
            if (savedEntry) {
                savedEntry.Hotels = savedEntry.Hotels.filter(hotel => hotel.toString() !== hotelId.toString());
                yield savedEntry.save();
                console.log("Hotel removed from saved list");
                const updatedSavedEntry = yield savedModel_1.default.findOne({ userId: id }).populate("Hotels");
                return updatedSavedEntry;
            }
            else {
                console.log("No saved entry found for this user");
                return null;
            }
        }
        catch (error) {
            console.error("Error removing from saved list:", error);
            throw error;
        }
    });
    const addStayType = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const newCategory = new categoryModel_1.default({
            name: name,
        });
        newCategory.save();
        return newCategory;
    });
    const StayTypeById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield categoryModel_1.default.findById(id); });
    const StayTypeByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(name, "name");
        const result = yield categoryModel_1.default.find({ name });
        console.log(result, "result");
        return result;
    });
    const allStayTypes = () => __awaiter(void 0, void 0, void 0, function* () { return yield categoryModel_1.default.find().sort({ createdAt: -1 }); });
    const updateStayType = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield categoryModel_1.default.findByIdAndUpdate(id, data);
        return result;
    });
    const deleteRoom = (roomId, hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield roomModel_1.default.findByIdAndDelete(roomId);
            try {
                yield hotelModel_1.default.findByIdAndUpdate(hotelId, { $pull: { rooms: roomId } });
            }
            catch (error) {
                console.log(error);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
    const addUnavilableDates = (rooms, dates) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            for (const room of rooms) {
                const roomId = room.roomId;
                const roomNumbers = room.roomNumbers;
                for (const roomNumber of roomNumbers) {
                    yield roomModel_1.default.updateOne({ _id: roomId, "roomNumbers.number": roomNumber }, { $addToSet: { "roomNumbers.$.unavailableDates": { $each: dates } } });
                }
            }
            return;
        }
        catch (error) {
            console.error("Error in add unavailable dates:", error);
            throw error;
        }
    });
    const removeUnavailableDates = (rooms, dates) => __awaiter(void 0, void 0, void 0, function* () {
        for (const room of rooms) {
            const roomId = room.roomId;
            const roomNumbers = room.roomNumbers;
            for (const roomNumber of roomNumbers) {
                yield roomModel_1.default.updateOne({ _id: roomId, "roomNumbers.number": roomNumber }, { $pull: { "roomNumbers.$.unavailableDates": { $in: dates } } });
            }
        }
        return;
    });
    const getHotelById = (Id) => __awaiter(void 0, void 0, void 0, function* () {
        const hotel = yield hotelModel_1.default.findById(Id);
        return hotel;
    });
    const getHotelByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const hotel = yield hotelModel_1.default.findOne({ name });
        return hotel;
    });
    const getHotelEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield hotelModel_1.default.findOne({ email });
        return user;
    });
    const getAllHotels = () => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({}).populate("ownerId").sort({ updatedAt: -1 });
        console.log(Hotels, "..............");
        const count = Hotels.length;
        return { Hotels, count };
    });
    const getUserHotels = () => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({
            isBlocked: false,
            isVerified: "verified",
            isListed: true
        })
            .populate({
            path: 'stayType',
            match: { isListed: true }
        })
            .populate({
            path: 'ownerId',
            match: { isBlocked: false }
        })
            .populate("rooms");
        // Filter out hotels where stayType or ownerId is null after population
        const filteredHotels = Hotels.filter(hotel => hotel.stayType && hotel.ownerId);
        const count = filteredHotels.length;
        return { Hotels: filteredHotels, count };
    });
    const getMyHotels = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.find({ ownerId });
        return Hotels;
    });
    const getHotelDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
        const Hotels = yield hotelModel_1.default.findById(id)
            .populate("rooms")
            .populate("ownerId")
            .populate("rating");
        return Hotels;
    });
    const updateHotelBlock = (id, status) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelModel_1.default.findByIdAndUpdate(id, { isBlocked: status }); });
    const update = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = yield hotelModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        return updatedHotel;
    });
    const updateRoom = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedRoom = yield roomModel_1.default.findByIdAndUpdate(id, updates, {
            new: true,
        });
        return updatedRoom;
    });
    const updateOffer = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = yield hotelModel_1.default.findByIdAndUpdate(id, {
            offer: updates,
        });
        return updatedHotel;
    });
    const removeOffer = (hotelId) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedHotel = yield hotelModel_1.default.findByIdAndUpdate(hotelId, {
            $unset: { offer: "" },
        });
        return updatedHotel;
    });
    const remove = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield hotelModel_1.default.deleteOne({ _id: id }); });
    const splitDate = (dateString) => {
        console.log(dateString);
        const [date, time] = dateString.split("T");
        const timeWithoutZ = time.replace("Z", ""); // Remove 'Z' from time
        return { date, time: timeWithoutZ };
    };
    const getDates = (startDate, endDate) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(startDate, endDate, "😀");
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        console.log(currentDate, end, "😄");
        const datesArray = [];
        while (currentDate <= end) {
            const formattedDate = new Date(currentDate);
            formattedDate.setUTCHours(0, 0, 0, 0);
            datesArray.push(formattedDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return datesArray;
    });
    const filterHotels = (destination, adults, children, room, startDate, endDate, amenities, minPrice, maxPrice, categories, skip, limit) => __awaiter(void 0, void 0, void 0, function* () {
        let hotels;
        console.log(categories, "Categories...................");
        if (destination) {
            const regex = new RegExp(destination, "i");
            hotels = yield hotelModel_1.default.find({
                $or: [{ destination: { $regex: regex } }, { name: { $regex: regex } }],
                isVerified: "verified",
                isListed: true,
                isBlocked: false,
            }).populate("rooms");
        }
        else {
            hotels = yield hotelModel_1.default.find({
                isVerified: "verified",
                isListed: true,
                isBlocked: false,
            }).populate("rooms");
        }
        const adultsInt = adults ? parseInt(adults) : 0;
        const childrenInt = children ? parseInt(children) : 0;
        hotels = hotels.filter((hotel) => {
            const filteredRooms = hotel.rooms.filter((room) => {
                return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt;
            });
            if (filteredRooms.length > 0) {
                hotel.rooms = filteredRooms;
                return true;
            }
            return false;
        });
        const start = splitDate(startDate);
        const end = splitDate(endDate);
        const dates = yield getDates(start.date, end.date);
        const isRoomNumberAvailable = (roomNumber) => {
            return !roomNumber.unavailableDates.some((date) => {
                const curr = new Date(date).toISOString().split("T")[0];
                return dates.includes(curr);
            });
        };
        if (minPrice && maxPrice && parseInt(maxPrice) !== 0) {
            const minPriceInt = parseInt(minPrice);
            const maxPriceInt = parseInt(maxPrice);
            console.log(minPriceInt, "-----", maxPriceInt);
            hotels = hotels.filter((hotel) => {
                const filteredRooms = hotel.rooms.filter((room) => {
                    const result = room.price !== undefined &&
                        room.price >= minPriceInt &&
                        room.price <= maxPriceInt;
                    return result;
                });
                if (filteredRooms.length > 0) {
                    hotel.rooms = filteredRooms;
                    return true;
                }
                return false;
            });
        }
        console.log(hotels, " before   hotelssssssssss");
        if (amenities) {
            const amenitiesArr = amenities.split(",");
            hotels = hotels.filter(hotel => {
                return amenitiesArr.some(amenity => hotel.amenities.includes(amenity));
            });
        }
        console.log(hotels, "hotelssssssssss");
        if (categories) {
            const categoriesArr = categories.split(",");
            hotels = hotels.filter(hotel => {
                return categoriesArr.some(category => hotel.stayType === category);
            });
        }
        const totalLength = hotels.length;
        console.log(hotels, "hotelssssssssss");
        const paginatedHotels = hotels.slice(skip, skip + limit);
        return { paginatedHotels, totalLength };
    });
    const UserfilterHotelBYId = (id, adults, children, room, startDate, endDate, minPrice, maxPrice) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Fetch the hotel by ID and populate rooms
            const hotel = yield hotelModel_1.default.findById(id).populate("rooms");
            if (!hotel) {
                throw new Error("Hotel not found");
            }
            // Convert string inputs to numbers
            const adultsInt = adults ? parseInt(adults) : 0;
            const childrenInt = children ? parseInt(children) : 0;
            // Filter rooms based on max adults and children
            hotel.rooms = hotel.rooms.filter((room) => {
                return room.maxAdults >= adultsInt && room.maxChildren >= childrenInt;
            });
            // Split start and end dates into parts
            const start = splitDate(startDate);
            const end = splitDate(endDate);
            // Get dates between start and end date
            const dates = yield getDates(start.date, end.date);
            // Function to check room availability
            const isRoomNumberAvailable = (roomNumber) => {
                return !roomNumber.unavailableDates.some((date) => {
                    const curr = new Date(date).toISOString().split("T")[0];
                    return dates.includes(curr);
                });
            };
            // Filter rooms again based on availability
            hotel.rooms.forEach((room) => {
                room.roomNumbers = room.roomNumbers.filter(isRoomNumberAvailable);
            });
            // Filter out rooms that have no available room numbers
            hotel.rooms = hotel.rooms.filter((room) => room.roomNumbers.length > 0);
            // Return the hotel with filtered rooms
            console.log(hotel, "Filtered hotel with available rooms");
            return hotel;
        }
        catch (error) {
            console.error("Error filtering hotel:", error);
            throw error;
        }
    });
    const updateHotelVerified = (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield hotelModel_1.default.findOneAndUpdate({ _id: id }, { isVerified: "verified" });
    });
    const updateHotelRejected = (id, updatingData) => __awaiter(void 0, void 0, void 0, function* () {
        yield hotelModel_1.default.findOneAndUpdate({ _id: id }, updatingData, {
            new: true,
            upsert: true,
        });
    });
    const updateUnavailableDates = (id, dates) => __awaiter(void 0, void 0, void 0, function* () {
        return yield hotelModel_1.default.updateOne({ _id: id }, { $addToSet: { unavailableDates: { $each: dates } } });
    });
    const getDatesInRange = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    };
    const checkAvailability = (id, RoomCount, checkInDate, checkOutDate) => __awaiter(void 0, void 0, void 0, function* () {
        const checkIn = splitDate(checkInDate);
        const checkOut = splitDate(checkOutDate);
        console.log(checkIn, checkOut, "dates before getdates");
        const dateArray = yield getDates(checkIn.date, checkOut.date);
        const formattedDateArray = dateArray.map((date) => new Date(date).toISOString().split("T")[0]);
        try {
            // Find the room by ID
            const roomExist = yield roomModel_1.default.findById(id);
            if (!roomExist) {
                throw new Error("Room not found");
            }
            const availableRooms = [];
            // Iterate over roomNumbers
            for (const room of roomExist.roomNumbers) {
                let isAvailable = true;
                // Check each date in dateArray against unavailableDates
                for (const unavailableDate of room.unavailableDates) {
                    const formattedUnavailableDate = new Date(unavailableDate).toISOString().split("T")[0];
                    if (formattedDateArray.includes(formattedUnavailableDate)) {
                        isAvailable = false;
                        break; // No need to check further dates for this room
                    }
                }
                if (isAvailable) {
                    availableRooms.push(room);
                }
                // Stop checking if we've found enough rooms
                if (availableRooms.length === RoomCount) {
                    break;
                }
            }
            if (availableRooms.length >= RoomCount) {
                return {
                    rooms: availableRooms.slice(0, RoomCount),
                    roomDetails: {
                        _id: roomExist._id,
                        title: roomExist.title,
                        price: roomExist.price,
                        maxChildren: roomExist.maxChildren,
                        maxAdults: roomExist.maxAdults,
                        desc: roomExist.desc,
                    },
                };
            }
            else {
                return null;
            }
        }
        catch (error) {
            console.error("Error checking room availability:", error);
            throw error;
        }
    });
    const addRating = (ratingData) => __awaiter(void 0, void 0, void 0, function* () {
        const result = new reviewModel_1.default({
            userId: ratingData.getUserId(),
            hotelId: ratingData.getHotelId(),
            rating: ratingData.getRating(),
            description: ratingData.getDescription(),
            imageUrls: ratingData.getImageUrls(),
        });
        const savedRating = yield result.save();
        try {
            yield hotelModel_1.default.findByIdAndUpdate(savedRating.hotelId, {
                $push: { rating: savedRating._id },
            });
        }
        catch (error) {
            console.log(error);
        }
        return savedRating;
    });
    const getRatings = (filter) => __awaiter(void 0, void 0, void 0, function* () { return yield reviewModel_1.default.find(filter).populate("userId"); });
    const getRatingById = (id) => __awaiter(void 0, void 0, void 0, function* () { return yield reviewModel_1.default.findById(id).populate("userId"); });
    const updateRatingById = (id, updates) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield reviewModel_1.default.findByIdAndUpdate(id, updates, { new: true });
            return result;
        }
        catch (error) {
            console.error('Error updating rating:', error);
            throw error;
        }
    });
    return {
        addHotel,
        addStayType,
        getHotelByName,
        getHotelEmail,
        getAllHotels,
        getMyHotels,
        getUserHotels,
        getHotelDetails,
        getHotelById,
        updateHotelBlock,
        update,
        remove,
        filterHotels,
        updateHotelVerified,
        updateHotelRejected,
        updateUnavailableDates,
        checkAvailability,
        addRoom,
        deleteRoom,
        addUnavilableDates,
        removeUnavailableDates,
        addRating,
        getRatings,
        getRatingById,
        updateRatingById,
        UserfilterHotelBYId,
        StayTypeById,
        allStayTypes,
        updateStayType,
        StayTypeByName,
        getSavedHotels,
        addOrRemoveFromSaved,
        removeFromSaved,
        updateRoom,
        updateOffer,
        removeOffer,
    };
};
exports.hotelDbRepository = hotelDbRepository;
