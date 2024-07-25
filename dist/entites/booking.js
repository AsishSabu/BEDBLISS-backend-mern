"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bookingEntity(firstName, lastName, phoneNumber, email, hotelId, userId, maxAdults, maxChildren, checkInDate, checkOutDate, totalDays, rooms, price, platformFee, paymentMethod) {
    return {
        getFirstName: () => firstName,
        getLastName: () => lastName,
        getPhoneNumber: () => phoneNumber,
        getEmail: () => email,
        getHotelId: () => hotelId,
        getUserId: () => userId,
        getMaxAdults: () => maxAdults,
        getMaxChildren: () => maxChildren,
        getCheckInDate: () => checkInDate,
        getCheckOutDate: () => checkOutDate,
        getTotalDays: () => totalDays,
        getRooms: () => rooms,
        getPrice: () => price,
        getPlatformFee: () => platformFee,
        getPaymentMethod: () => paymentMethod,
        // getPaymentStatus: (): string => paymentStatus,
        // getStatus: (): string => status,
    };
}
exports.default = bookingEntity;
