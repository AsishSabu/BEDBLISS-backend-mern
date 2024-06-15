import expressAsyncHandler from "express-async-handler"
import { NextFunction, Request, Response } from "express"
import { bookingDbInterfaceType } from "../../app/interfaces/bookingDbInterface"
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface"
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB"
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB"
import createBooking, {
  addUnavilableDates,
  cancelBookingAndUpdateWallet,
  getBookings,
  getBookingsById,
  makePayment,
  updateBookingStatus,
} from "../../app/use-cases/Booking/booking"
import { HotelServiceInterface } from "../../app/service-interface/hotelServices"
import { HotelServiceType } from "../../frameworks/services/hotelServices"
import { HttpStatus } from "../../types/httpStatus"
import { getUserProfile } from "../../app/use-cases/User/read&write/profile"
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces"
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB"

export default function bookingController(
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

  const handleBooking = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const bookingDetails = req.body
        const userId = req.user

        const {data,rooms} = await createBooking(
          userId,
          bookingDetails,
          dbRepositoryBooking,
          dbRepositoryHotel,
          hotelService
        )

        if (data && data.paymentMethod === "Online") {
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
        } else if(data && data.paymentMethod === "Wallet") {
          const dates = await addUnavilableDates(
            rooms, 
            data.checkInDate ?? new Date(), 
            data.checkOutDate ?? new Date(), 
            dbRepositoryHotel,
            hotelService
          );
          
          res.status(HttpStatus.OK).json({
            success: true,
            message: "Booking created successfully using Wallet",
            booking: data,
          })
        }else{
          const dates = await addUnavilableDates(
            rooms, 
            data.checkInDate ?? new Date(), 
            data.checkOutDate ?? new Date(), 
            dbRepositoryHotel,
            hotelService
          );          
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
      console.log(paymentStatus)
      // if(paymentStatus==="Paid"){
      //   const bookings = await getBookingsById(id, dbRepositoryBooking)
      //   if(bookings){
      //     const dates = await addUnavilableDates(
      //       bookings.hotelId?.toString() ?? "", 
      //       bookings.checkInDate ?? new Date(), 
      //       bookings.checkOutDate ?? new Date(), 
      //       dbRepositoryHotel,
      //       hotelService
      //     );          
      //   }

      // }

      // await updateBookingStatus(
      //   id,
      //   paymentStatus,
      //   dbRepositoryBooking,
      //   dbRepositoryHotel
      // )
      res
        .status(HttpStatus.OK)
        .json({ success: true, message: "Booking status updated" })
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
      const bookings = await getBookingsById(ID, dbRepositoryBooking)          
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
      const userID = req.user;
      const { bookingID } = req.params;
      console.log(bookingID);
      console.log(userID);
      
      

      const updateBooking = await cancelBookingAndUpdateWallet(
        userID,
        bookingID,
        dbRepositoryBooking,
        dbRepositoryUser
      );
      res.status(HttpStatus.OK).json({
        success: true,
        message: "Booking cancelled successfully",
        booking: updateBooking,
      });
    } catch (error) {
      next(error);
    }
  };

  // const handleCancelBooking = expressAsyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const { bookingId } = req.params;
  //     const userId = req.query?.userId as string

  //     const data: any = await cancdelBooking(bookingId, bookingRepo);

  //     if(userId){
  //       const result = await addMoney(userId, data?.price, walletRepo, transRepo);
  //     }

  //     res.status(HttpStatus.OK).json({
  //       status: "success",
  //       messaage: `${bookingId?.substring(0, 10)} has been cancelled`,
  //     });
  //   }
  // );

  // const handleGettingAllBookingOfHotel = expressAsyncHandler(
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const { hotelId } = req.params;
  //     const page = parseInt(req.query?.page as string);
  //     const limit = parseInt(req.query?.limit as string);
  //     console.log("pagination parameters", page, limit);

  //     const bookings = await fetchAllBookingsOfHotel(
  //       hotelId,
  //       page,
  //       limit,
  //       bookingRepo
  //     );

  //     res.status(HttpStatus.OK).json({
  //       status: "success",
  //       messaage: "All bookings has been fetched",
  //       bookings: bookings,
  //     });
  //   }
  // );



 

  return {
    handleBooking,
    updatePaymentStatus,
    getBooking,
    getBookingById,
    cancelBooking

  }
}
