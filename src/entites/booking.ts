import mongoose from "mongoose";

export default function bookingEntity(
  firstName: string,
  lastName: string,
  phoneNumber: number,
  email: string,
  hotelId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  maxAdults: number,
  maxChildren: number,
  checkInDate: string,
  checkOutDate: string,
  totalDays: number,
  rooms: [],
  price: number,
  platformFee: number,
  paymentMethod: string,
  // paymentStatus: string,
  // status: string
) {
  return {
    getFirstName: (): string => firstName,
    getLastName: (): string => lastName,
    getPhoneNumber: (): number => phoneNumber,
    getEmail: (): string => email,
    getHotelId: (): mongoose.Types.ObjectId => hotelId,
    getUserId: (): mongoose.Types.ObjectId => userId,
    getMaxAdults: (): number => maxAdults,
    getMaxChildren: (): number => maxChildren,
    getCheckInDate: (): string => checkInDate,
    getCheckOutDate: (): string => checkOutDate,
    getTotalDays: (): number => totalDays,
    getRooms: (): [] => rooms,
    getPrice: (): number => price,
    getPlatformFee: (): number => platformFee,
    getPaymentMethod: (): string => paymentMethod,
    // getPaymentStatus: (): string => paymentStatus,
    // getStatus: (): string => status,
  };
}

export type bookingEntityType = ReturnType<typeof bookingEntity>;
