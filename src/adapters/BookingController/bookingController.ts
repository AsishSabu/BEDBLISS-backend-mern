import expressAsyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { bookingDbInterfaceType } from "../../app/interfaces/bookingDbInterface"
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface"
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"
import createBooking, {
  addNewReporting,
  addUnavilableDates,
  cancelBookingAndUpdateWallet,
  getBookings,
  getBookingsByHotels,
  getBookingsById,
  getBookingsBybookingId,
  makePayment,
  removeUnavilableDates,
  reportingsByFilter,
  updateBookingDetails,
  updateBookingStatus,
} from "../../app/use-cases/Booking/booking"
import { HotelServiceInterface } from "../../app/service-interface/hotelServices"
import { HotelServiceType } from "../../frameworks/services/hotelServices"
import { HttpStatus } from "../../types/httpStatus"
import { getUserProfile } from "../../app/use-cases/User/read&write/profile"
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces"
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB"
import { getMyHotels } from "../../app/use-cases/Owner/hotel"
import { BookingServiceInterface } from "../../app/service-interface/bookingServices"
import { BookingServiceType } from "../../frameworks/services/bookingService"
import { HotelInterface } from "../../types/HotelInterface"

export default function bookingController(
  bookingServiceInterface: BookingServiceInterface,
  bookingServiceImpl: BookingServiceType,
  bookingDbRepository: bookingDbInterfaceType,
  bookingDbRepositoryImp: bookingDbRepositoryType,
  hotelDbRepository: hotelDbInterfaceType,
  hotelDbRepositoryImpl: hotelDbRepositoryType,
  hotelServiceInterface: HotelServiceInterface,
  hotelServiceImpl: HotelServiceType,
  userDbRepository: userDbInterfaceType,
  userDbRepositoryImpl: userDbRepositoryType
) {
  const dbRepositoryBooking = bookingDbRepository(bookingDbRepositoryImp())
  const dbRepositoryHotel = hotelDbRepository(hotelDbRepositoryImpl())
  const dbRepositoryUser = userDbRepository(userDbRepositoryImpl())
  const hotelService = hotelServiceInterface(hotelServiceImpl())
  const bookingService = bookingServiceInterface(bookingServiceImpl())

  const handleBooking = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const bookingDetails = req.body
        const userId = req.user
        console.log(req.body, "req.body")

        const data = await createBooking(
          userId,
          bookingDetails,
          dbRepositoryBooking,
          dbRepositoryHotel,
          hotelService,
          dbRepositoryUser
        )

        if (data && data.paymentMethod === "Online") {
          console.log("in online payment")

          const user = await getUserProfile(userId, dbRepositoryUser)

          if (typeof data.price === "number") {
            console.log("before payment")

            const sessionId = await makePayment(
              user?.name,
              user?.email,
              data.bookingId,
              data.price
            )
            res.status(HttpStatus.OK).json({
              success: true,
              message: "Booking created successfully",
              id: sessionId,
            })
          } else {
            throw new Error("Invalid price for online payment")
          }
        } else if (data && data.paymentMethod === "Wallet") {
          const dates = await addUnavilableDates(
            data.rooms,
            data.checkInDate ?? new Date(),
            data.checkOutDate ?? new Date(),
            dbRepositoryHotel,
            hotelService
          )

          res.status(HttpStatus.OK).json({
            success: true,
            message: "Booking created successfully using Wallet",
            booking: data,
          })
        } else {
          console.log("in checkout payment")
          const dates = await addUnavilableDates(
            data.rooms,
            data.checkInDate ?? new Date(),
            data.checkOutDate ?? new Date(),
            dbRepositoryHotel,
            hotelService
          )
          res.status(HttpStatus.OK).json({
            success: true,
            message: "Booking created successfully ",
            booking: data,
          })
        }
      } catch (error) {
        next(error)
      }
    }
  )

  const updatePaymentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { paymentStatus } = req.body
      console.log(id)
      console.log(paymentStatus, "payment status")
      if (paymentStatus === "Failed") {
        const bookings = await getBookingsBybookingId(id, dbRepositoryBooking)
        console.log(bookings, "bokings")

        if (bookings) {
          const removedates = await removeUnavilableDates(
            bookings.rooms,
            bookings.checkInDate as unknown as Date,
            bookings.checkOutDate as unknown as Date,
            dbRepositoryHotel,
            hotelService
          )
        }
      }

      const result = await updateBookingStatus(
        id,
        paymentStatus,
        dbRepositoryBooking,
        dbRepositoryHotel,
        dbRepositoryUser
      )

      if (result) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: "Booking status updated succesfully",
          result,
        })
      }
    } catch (error) {
      next(error)
    }
  }
  const getBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user
      console.log(userID)
      const bookings = await getBookings(userID, dbRepositoryBooking)

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      })
    } catch (error) {
      next(error)
    }
  }
  const getBookingById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ID = req.params.id
      console.log(ID, "booking id")

      const bookings = await getBookingsById(ID, dbRepositoryBooking)
      console.log(bookings, "booking details")

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      })
    } catch (error) {
      next(error)
    }
  }

  const addUnavilableDate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = req.body
    console.log(req.body)

    const result = await addUnavilableDates(
      data.rooms,
      data.checkInDate ?? new Date(),
      data.checkOutDate ?? new Date(),
      dbRepositoryHotel,
      hotelService
    )
    console.log(result, ".......................................")

    res.status(HttpStatus.OK).json({
      success: true,
      message: "dates added successfully",
      result,
    })
  }

  const getByBookingId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const ID = req.params.id
      console.log(ID, "booking id")

      const bookings = await getBookingsBybookingId(ID, dbRepositoryBooking)
      console.log(bookings, "booking details")

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      })
    } catch (error) {
      next(error)
    }
  }
  const cancelBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("in cancel booking")

      const userID = req.user
      const { reason, status } = req.body
      console.log(req.body)

      const { bookingID } = req.params
      console.log(bookingID)
      console.log(userID)

      const updateBooking = await cancelBookingAndUpdateWallet(
        userID,
        bookingID,
        status,
        reason,
        dbRepositoryBooking,
        dbRepositoryUser,
        bookingService
      )
      if (updateBooking) {
        const dates = await removeUnavilableDates(
          updateBooking.rooms,
          updateBooking.checkInDate ?? new Date(),
          updateBooking.checkOutDate ?? new Date(),
          dbRepositoryHotel,
          hotelService
        )
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Booking cancelled successfully",
        booking: updateBooking,
      })
    } catch (error) {
      next(error)
    }
  }
  const updateBooking = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user
      console.log("in update booking")
      const { reason, status } = req.body
      console.log(req.body)

      const { bookingID } = req.params

      const updateBooking = await updateBookingDetails(
        userID,
        status,
        reason,
        bookingID,
        dbRepositoryBooking,
        dbRepositoryUser
      )
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Booking cancelled successfully",
        booking: updateBooking,
      })
    } catch (error) {
      next(error)
    }
  }

  const getOwnerBookings = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userID = req.user
      console.log(userID)
      const hotels = await getMyHotels(userID, dbRepositoryHotel)

      console.log(
        hotels,
        "-----------------------------------------------------------"
      )

      const HotelIds: string[] = hotels.map(hotel => hotel._id.toString())
      console.log(
        HotelIds,
        "-----------------------------------------------------------"
      )

      const bookings = await getBookingsByHotels(HotelIds, dbRepositoryBooking)
      console.log(bookings)

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Bookings fetched successfully",
        bookings,
      })
    } catch (error) {
      next(error)
    }
  }

  const addReporting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.params.userId
    const data = req.body
    const result = await addNewReporting(userId, data, dbRepositoryBooking)
    if (result) {
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "  Successfully added reporting" })
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }
  const getReporting = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const Id = req.params.id
    const result = await reportingsByFilter(Id,dbRepositoryBooking)
    if (result) {
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: "  Successfully fetched reporting" }),
        result
    } else {
      return res.status(HttpStatus.NOT_FOUND).json({ success: false })
    }
  }

  return {
    handleBooking,
    updatePaymentStatus,
    getBooking,
    getBookingById,
    cancelBooking,
    updateBooking,
    getOwnerBookings,
    addReporting,
    getByBookingId,
    addUnavilableDate,
    getReporting
  }
}
