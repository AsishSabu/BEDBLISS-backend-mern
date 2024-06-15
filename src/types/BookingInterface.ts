export interface BookingInterface {
    firstName: string;
    lastName:string;
    phoneNumber: number;
    email: string;
    roomId: string;
    hotelId: string;
    userId: string;
    maxAdults: number;
    maxChildren:number;
    rooms:[]
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

  export type TransactionDataType = {
    newBalance: number;
    type: "Debit" | "Credit";
    description: string;
  };
  