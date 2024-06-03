import mongoose from "mongoose";

export default function bookingEntity(
  firstName: string,
  lastName:string,
  phoneNumber: number,
  email: string,
  hotelId:  mongoose.Types.ObjectId,
  userId:  mongoose.Types.ObjectId,
  maxPeople: number,
  checkInDate: string,
  checkOutDate: string,
  totalDays: number,
  price: number,
  paymentMethod:string,
  // paymentStatus:string,
  // status:string
) {
  return {
    getfirstName: (): string => firstName,
    getlastName:():string=>lastName,
    getPhoneNumber: (): number => phoneNumber,
    getEmail: (): string => email,
    getHotelId: (): mongoose.Types.ObjectId => hotelId,
    getUserId: () :  mongoose.Types.ObjectId => userId,
    getMaxPeople: (): number => maxPeople,
    checkInDate: (): string => checkInDate,
    checkOutDate: ():string => checkOutDate,
    getTotalDays: (): number => totalDays,
    getPrice: (): number => price,
    getPaymentMethod:():string=>paymentMethod,
    // getPaymentStatus:():string=>paymentStatus,
    // getStatus:():string=>status,
  };
}

export type bookingEntityType = ReturnType<typeof bookingEntity>;