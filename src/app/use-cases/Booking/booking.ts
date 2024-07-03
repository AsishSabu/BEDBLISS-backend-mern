import mongoose, { ObjectId } from "mongoose"
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
import { BookingServiceInterface } from "../../service-interface/bookingServices"
import reportingEntity from "../../../entites/reporting"

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
  console.log(bookingDetails, "bookingDetails")
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !hotelId ||
    !userId ||
    !maxAdults ||
    !rooms ||
    !checkInDate ||
    !checkOutDate ||
    !price ||
    !totalDays ||
    !paymentMethod
  ) {
    console.log("missing fields")

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
    paymentMethod
  )
  const data = await bookingRepository.createBooking(bookingEntity)
  console.log(data, "......................................")

  if (data.paymentMethod === "Wallet") {
    const wallet = await userRepository.getWallet(data.userId as string)
    console.log(wallet, "wallet in payment??????????????????????????????")

    if (wallet && data && data.price && wallet?.balance >= data.price) {
      const transactionData: TransactionDataType = {
        newBalance: data.price,
        type: "Debit",
        description: "Booking transaction",
      }
      await updateWallet(data.userId as string, transactionData, userRepository)
      await updateBookingStatus(
        data._id as unknown as string,
        "Paid",
        bookingRepository,
        hotelRepository
      )
    } else {
      throw new AppError("Insufficient wallet balance", HttpStatus.BAD_REQUEST)
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
  const dates = await hotelService.unavailbleDates(
    checkInDate.toString(),
    checkOutDate.toString()
  )
  console.log(dates, "dates..................")
  console.log(rooms, "rooms")
  const addDates = await hotelRepository.addUnavilableDates(rooms, dates)
}

export const removeUnavilableDates = async (
  rooms: any,
  checkInDate: Date,
  checkOutDate: Date,
  hotelRepository: ReturnType<hotelDbInterfaceType>,
  hotelService: ReturnType<HotelServiceInterface>
) => {
  const dates = await hotelService.unavailbleDates(
    checkInDate.toString(),
    checkOutDate.toString()
  )
  console.log(dates, "dates..................")
  console.log(rooms, "rooms")
  const addDates = await hotelRepository.removeUnavailableDates(rooms, dates)
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
  const updationData: Record<string, any> = {
    paymentStatus,
  }
  console.log(updationData, "updationData....................")

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

export const updateBookingDetails = async (
  userID: string,
  status: string,
  reason: string,
  bookingID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  if (!bookingID)
    throw new AppError("Please provide a booking ID", HttpStatus.BAD_REQUEST)
  let bookingDetails
  if (status === "booked") {
    bookingDetails = await bookingRepository.updateBooking(bookingID, {
      bookingStatus: status,
    })
  } else {
    bookingDetails = await bookingRepository.updateBooking(bookingID, {
      bookingStatus: status,
      Reason: reason,
    })
  }

  console.log(bookingDetails, "booking details.............")
  return bookingDetails
}

export const cancelBookingAndUpdateWallet = async (
  userID: string,
  bookingID: string,
  status: string,
  reason: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
  userRepository: ReturnType<userDbInterfaceType>,
  bookingService: ReturnType<BookingServiceInterface>
): Promise<any> => {
  if (!bookingID) {
    throw new AppError("Please provide a booking ID", HttpStatus.BAD_REQUEST)
  }

  const bookingDetails = await bookingRepository.updateBooking(bookingID, {
    bookingStatus: status,
    Reason: reason,
  })

  let bookerId: string | undefined
  if (bookingDetails?.userId) {
    if (typeof bookingDetails.userId === "string") {
      bookerId = bookingDetails.userId
    } else if (bookingDetails.userId instanceof mongoose.Types.ObjectId) {
      bookerId = bookingDetails.userId.toString()
    }
  }

  if (bookingDetails && bookingDetails.paymentMethod !== "pay_on_checkout") {
    console.log("in updating wallet")

    if (bookingDetails.bookingStatus === "cancelled") {
      const dateDifference = await bookingService.dateDifference(
        bookingDetails.updatedAt,
        bookingDetails.checkInDate ?? 0
      )
      console.log(bookingDetails.updatedAt, "updated date")
      console.log(bookingDetails.checkInDate, "checkin date")

      console.log(dateDifference, "dateDifference")

      const paidPrice = bookingDetails.price
      if (paidPrice !== undefined && paidPrice !== null) {
        const platformFee = paidPrice * 0.05
        let refundAmount: number = paidPrice - platformFee
        console.log(refundAmount, "price after reducing platform fee")

        if (dateDifference !== undefined && dateDifference > 2) {
          const isRoomCountLessThanOrEqualTo5 = bookingDetails.rooms.length <= 5

          if (isRoomCountLessThanOrEqualTo5) {
            if (dateDifference > 7) {
              refundAmount = refundAmount
            } else if (dateDifference <= 7) {
              refundAmount /= 2
            }
          } else {
            if (dateDifference > 10) {
              refundAmount = refundAmount
            } else if (dateDifference <= 10) {
              refundAmount /= 2
            }
          }
          console.log(refundAmount, "refund amount")

          const data: TransactionDataType = {
            newBalance: refundAmount,
            type: "Credit",
            description: "Booking cancelled by user refund amount",
          }
          if (bookerId !== undefined && bookerId !== null) {
            await updateWallet(bookerId, data, userRepository)
          }
          const updateBooking = await bookingRepository.updateBooking(
            bookingID,
            {
              bookingStatus: "cancelled with refund",
              paymentStatus: "Refunded",
            }
          )
        } else {
          console.error("Date difference is less than 2 or undefined")
        }
      }
    } else {
      const data: TransactionDataType = {
        newBalance: bookingDetails?.price ?? 0,
        type: "Credit",
        description: "Booking cancelled by owner refund amount",
      }
      if (bookerId !== undefined && bookerId !== null) {
        await updateWallet(bookerId, data, userRepository)
      }
      const updateBooking = await bookingRepository.updateBooking(bookingID, {
        bookingStatus: "cancelled with refund",
        paymentStatus: "Refunded",
      })
    }
  }

  return bookingDetails
}

export const getTransaction = async (
  userId: string,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  console.log(userId)

  const wallet = await userRepository.getWallet(userId)
  console.log(wallet)

  if (!wallet) {
    throw new Error("Wallet not found")
  }
  const walletID = wallet._id
  const transactions = await userRepository.getTransaction(walletID)
  return transactions
}

export const updateWallet = async (
  userId: string,
  transactionData: TransactionDataType,
  userRepository: ReturnType<userDbInterfaceType>
) => {
  const { newBalance, type, description } = transactionData
  console.log(transactionData, "transation data")

  const balance = type === "Debit" ? -newBalance : newBalance
  console.log(userId, "userId", balance, "balance")
  const updateWallet = await userRepository.updateWallet(userId, balance)
  console.log(updateWallet, "update wallet")

  if (updateWallet) {
    const transactionDetails = transactionEntity(
      updateWallet?._id,
      newBalance,
      type,
      description
    )
    const transaction = await userRepository.createTransaction(
      transactionDetails
    )
  }
}

export const addNewReporting = async (
  userId: string,
  reportingData: { hotelId: string; bookingId: string; reason: string },
  bookingRepository: ReturnType<bookingDbInterfaceType>,
) => {
  const { hotelId, bookingId, reason } = reportingData
  const newReportingEntity = reportingEntity(userId, hotelId, bookingId, reason)

  return await bookingRepository.addReporting(newReportingEntity)
}
export const reportings = async (
  bookingRepository: ReturnType<bookingDbInterfaceType>,
) => await bookingRepository.getReportings();


export const reportingsByFilter = async (
  ID: string,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
) => await bookingRepository.getReportingsByFilter(ID);

export const updateReporting = async (
  ID: string,
  updateData:any,
  bookingRepository: ReturnType<bookingDbInterfaceType>,
) => await bookingRepository.updateReporting(ID,updateData);
