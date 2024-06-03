export interface BookingInterface {
    firstName: string;
    lastName:string;
    phoneNumber: number;
    email: string;
    roomId: string;
    hotelId: string;
    userId: string;
    maxPeople: number;
    checkInDate: string;
    checkOutDate: string;
    totalDays:number
    price: number,
    paymentMethod:string
  }
  export interface dateInterface {
    checkInDate: string;
    checkOutDate: string;

  }