import mongoose from "mongoose"
import Stripe from "stripe"
import createBookingEntity from "../../../entites/booking"
import {
  BookingInterface,
  TransactionDataType,
  dateInterface,
} from "../../../types/BookingInterface"
import { HttpStatus } from "../../../types/httpStatus"
import AppError from "../../../utils/appError"
import { bookingDbInterfaceType } from "../../interfaces/bookingDbInterface"
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface"
import { HotelServiceInterface } from "../../service-interface/hotelServices"
import configKeys from "../../../config"
import { userDbInterfaceType } from "../../interfaces/userDbInterfaces"
import transactionEntity from "../../../entites/transactionEntity"

export default async function createBooking(
  userId: string,
  bookingDetails: BookingInterface,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
  hotelRepository: ReturnType<hotelDbInterfaceType>,
  hotelSerice: ReturnType<HotelServiceInterface>,
  userRepository: ReturnType<userDbInterfaceType>
) {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    hotelId,
    maxAdults,
    maxChildren,
    rooms,
    checkInDate,
    checkOutDate,
    totalDays,
    price,
    paymentMethod,
  } = bookingDetails
  console.log(bookingDetails,"bookingDetails")
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !hotelId ||
    !userId ||
    !maxAdults||
    !rooms||
    !checkInDate ||
    !checkOutDate ||
    !price ||
    !totalDays ||
    !paymentMethod
  ) {
    console.log("missing fields");
    
    throw new AppError("Missing fields in Booking", HttpStatus.BAD_REQUEST)
  }
  //creating booking entities

  const bookingEntity = createBookingEntity(
    firstName,
    lastName,
    phoneNumber,
    email,
    new mongoose.Types.ObjectId(hotelId),
    new mongoose.Types.ObjectId(userId),
    maxAdults,
    maxChildren,
    checkInDate,
    checkOutDate,
    totalDays,
    rooms,
    price,
    paymentMethod,
  )
  const data = await bookingRepository.createBooking(bookingEntity)
  console.log(data,"......................................");
  

  if(data.paymentMethod==="Wallet"){
    const wallet=await userRepository.getWallet(data.userId as string)
    console.log(wallet,"wallet in payment??????????????????????????????");

    if (wallet&&data&&data.price&&wallet?.balance >= data.price) {
      const transactionData: TransactionDataType = {
        newBalance: data.price,
        type: "Debit",
        description: "Booking transaction",
      };
      await updateWallet(data.userId as string, transactionData, userRepository);
      await updateBookingStatus(
        data._id as unknown as string,
        "Paid" ,
        bookingRepository,
        hotelRepository
      )
    } else {
      throw new AppError(
        "Insufficient wallet balance",
        HttpStatus.BAD_REQUEST
      );
    }
    
  }

  return data
}

export const addUnavilableDates = async (
  rooms: any,
  checkInDate: Date,
  checkOutDate: Date,
  hotelRepository: ReturnType<hotelDbInterfaceType>,
  hotelService: ReturnType<HotelServiceInterface>
) => {
  const dates = await hotelService.unavailbleDates(checkInDate.toString(),checkOutDate.toString())
  console.log(dates,'dates..................');
  console.log(rooms,'rooms');
  const addDates=await hotelRepository.addUnavilableDates(rooms,dates)
}

export const checkAvailability = async (
  id: string,
  dates: dateInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) =>
  await hotelRepository.checkAvailability(
    id,
    dates.checkInDate,
    dates.checkOutDate
  )

export const makePayment = async (
  userName: string = "John Doe",
  email: string = "johndoe@gmail.com",
  bookingId: string,
  totalAmount: number
) => {
  console.log(bookingId, "id")
  console.log(totalAmount, "amount")

  const stripe = new Stripe(configKeys.STRIPE_SECRET_KEY)

  const customer = await stripe.customers.create({
    name: userName,
    email: email,
    address: {
      line1: "Los Angeles, LA",
      country: "US",
    },
  })
  console.log(customer, "customer")

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer: customer.id,
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: { name: "Guests", description: "Room booking" },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${configKeys.CLIENT_PORT}/user/payment_status/${bookingId}?success=true`,
    cancel_url: `${configKeys.CLIENT_PORT}/user/payment_status/${bookingId}?success=false`,
  })
  return session.id
}

export const updateBookingStatus = async (
  id: string,
  paymentStatus: "Paid" | "Failed",
  bookingRepository: ReturnType<bookingDbInterfaceType>,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const bookingStatus = paymentStatus === "Paid" ? "booked" : "pending"
  const updationData: Record<string, any> = {
    paymentStatus,
    bookingStatus,
  }
  console.log(updationData,"updationData....................")

  const bookingData = await bookingRepository.updateBooking(id, updationData)

}

export const getBookings = async (
  userID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getBooking(userID)

export const getBookingsById = async (
  userID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getBookingById(userID)

export const getBookingsBybookingId = async (
  userID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getBookingsBybookingId(userID)

export const getBookingsByHotel = async (
  userID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getBookingByHotel(userID)

export const getBookingsByHotels = async (
  userID: string[],
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getBookingByHotels(userID)

export const getALLBookings = async (
  bookingRepository: ReturnType<bookingDbInterfaceType>
) => await bookingRepository.getAllBooking()


export const cancelBookingAndUpdateWallet = async (
  userID: string,
  bookingID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  if (!bookingID)
    throw new AppError(
      "Please provide a booking ID",
      HttpStatus.BAD_REQUEST
    );

  const bookingDetails = await bookingRepository.updateBooking(
    bookingID,
    {
      bookingStatus: "Cancelled",
      paymentStatus: "Refunded",
    }
  );
  console.log(bookingDetails,"booking details.............");
  
  if (bookingDetails) {
    console.log("in updating wallet");
    
    const data: TransactionDataType = {
      newBalance: bookingDetails?.price??0,
      type: "Credit",
      description: "Booking cancellation refund amount",
    };
    const updateWalletDetails = await updateWallet(
      userID,
      data,
      userRepository
    );
  }
  return bookingDetails;
};

export const getTransaction=async(
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>
)=>{ 
  console.log(userId);
  
  const wallet=await userRepository.getWallet(userId)
  console.log(wallet);
  
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  const walletID=wallet._id 
  const transactions=await userRepository.getTransaction(walletID)
  return transactions
}

export const updateWallet = async (
  userId: string,
  transactionData: TransactionDataType,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  const { newBalance, type, description } = transactionData;
  console.log(transactionData,"transation data");
  
  const balance = type === "Debit" ? -newBalance : newBalance;
  console.log(userId);
  
  const updateWallet = await userRepository.updateWallet(userId, balance);

  if (updateWallet) {
    const transactionDetails = transactionEntity(
      updateWallet?._id,
      newBalance,
      type,
      description
    );
    const transaction = await userRepository.createTransaction(
      transactionDetails
    );
  }
};