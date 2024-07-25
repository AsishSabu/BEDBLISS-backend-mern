"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reportingEntity(userId, hotelId, bookingId, reason) {
    return {
        getUserId: () => userId,
        getHotelId: () => hotelId,
        getBookingId: () => bookingId,
        getReason: () => reason,
    };
}
exports.default = reportingEntity;
