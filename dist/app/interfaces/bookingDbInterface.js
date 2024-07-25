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
function bookingDbInterface(repository) {
    const createBooking = (bookingEntity) => __awaiter(this, void 0, void 0, function* () { return yield repository.createBooking(bookingEntity); });
    const getAllBooking = () => __awaiter(this, void 0, void 0, function* () { return yield repository.getAllBooking(); });
    const getBooking = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingByuser(bookingId); });
    const getBookingById = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingById(bookingId); });
    const getBookingsBybookingId = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingBybookingId(bookingId); });
    const getBookingByHotel = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingByHotel(bookingId); });
    const deleteBooking = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.deleteBooking(bookingId); });
    const updateBooking = (bookingId, updates) => __awaiter(this, void 0, void 0, function* () { return yield repository.updateBooking(bookingId, updates); });
    const getBookingByHotels = (bookingId) => __awaiter(this, void 0, void 0, function* () { return yield repository.getBookingByHotels(bookingId); });
    const addReporting = (reportingData) => __awaiter(this, void 0, void 0, function* () { return yield repository.addReporting(reportingData); });
    const getReportings = () => __awaiter(this, void 0, void 0, function* () { return yield repository.getReportings(); });
    const getReportingsByFilter = (id) => __awaiter(this, void 0, void 0, function* () { return yield repository.getReportingsByFilter(id); });
    const updateReporting = (reportId, updates) => __awaiter(this, void 0, void 0, function* () { return yield repository.updateReporting(reportId, updates); });
    return {
        createBooking,
        getAllBooking,
        getBooking,
        deleteBooking,
        updateBooking,
        getBookingById,
        getBookingByHotel,
        getBookingsBybookingId,
        getBookingByHotels,
        addReporting,
        getReportings,
        getReportingsByFilter,
        updateReporting
    };
}
exports.default = bookingDbInterface;
