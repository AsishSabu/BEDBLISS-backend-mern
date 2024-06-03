import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express"
import { bookingDbInterfaceType } from "../../app/interfaces/bookingDbInterface";
import { hotelDbInterfaceType } from "../../app/interfaces/hotelDbInterface";
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB";
import { hotelDbRepositoryType } from "../../frameworks/database/repositories/hotelRepositoryMongoDB";
import createBooking, { makePayment } from "../../app/use-cases/Booking/booking";
import { HotelServiceInterface } from "../../app/service-interface/hotelServices";
import { HotelServiceType } from "../../frameworks/services/hotelServices";
import { HttpStatus } from "../../types/httpStatus";
import { getUserProfile } from "../../app/use-cases/User/read&write/profile";
import { userDbInterfaceType } from "../../app/interfaces/userDbInterfaces";
import { userDbRepositoryType } from "../../frameworks/database/repositories/userRepostoryMongoDB";

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
    const dbRepositoryUser = userDbRepository(userDbRepositoryImpl());
    const hotelService=hotelServiceInterface(hotelServiceImpl())
    const handleBooking = expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const bookingDetails = req.body;
          const userId = req.user;
          console.log(userId);
    
          const data = await createBooking(
            userId,
            bookingDetails,
            dbRepositoryBooking,
            dbRepositoryHotel,
            hotelService
          );
    
          if (data && data.paymentMethod === "Online") {
            const user = await getUserProfile(userId, dbRepositoryUser);
            console.log(user);
    
            if (typeof data.price === 'number') {
              console.log("before payment");
              
              const sessionId = await makePayment(
                user?.name,
                user?.email,
                data.bookingId,
                data.price
              );
              console.log("after");
              
              res.status(HttpStatus.OK).json({
                success: true,
                message: "Booking created successfully",
                id: sessionId,
              });
            } else {
              throw new Error('Invalid price for online payment');
            }
          } else {
            res.status(HttpStatus.OK).json({
              success: true,
              message: "Booking created successfully using Wallet",
              booking: data,
            });
          }
        } catch (error) {
          next(error);
        }
      }
    );
    
  
    // const handlePayment = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     console.log("in payment section");
  
    //     const { paymentMethod } = req.body;
    //     const id: any = req.query.id;
    //     // console.log(id, paymentMethod);
    //     const data = await payment(
    //       id,
    //       paymentMethod,
    //       payments,
    //       bookingRepo,
    //       roomRepo
    //     );
  
    //     // res.redirect(data?.url)
    //     res
    //       .status(HttpStatus.OK)
    //       .json({
    //         status: "success",
    //         message: "payment has been successfull",
    //         url: data?.url,
    //       });
    //   }
    // );
  
    // const handleGetAllBookingsOfUser = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const { userId } = req.params;
    //     const page = parseInt(req.query?.page as string);
    //     const limit = parseInt(req.query?.limit as string);
  
    //     const data = await getAllUserBookings(userId, page, limit, bookingRepo);
  
    //     res.status(HttpStatus.OK).json({
    //       status: "success",
    //       messaage: "All Bookings has been fetched",
    //       data: data,
    //     });
    //   }
    // );
  
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
  
    // const handleFetchingBookingDetails = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const bookingId = req.query["bookingId"]?.toString();
  
    //     const booking = await getBookingDetails(bookingId, bookingRepo);
  
    //     res.status(HttpStatus.OK).json({
    //       status: "success",
    //       message: "Booking details has been fetched successfully",
    //       booking,
    //     });
    //   }
    // );
  
    // const handleStatsuChange = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const bookingId = req.query?.bookingId?.toString();
    //     const status = req.query?.status?.toString();
  
    //     await changeBookingStatus(bookingId, status, bookingRepo);
  
    //     res.status(HttpStatus.OK).json({
    //       status: "success",
    //       message: "Successfully updated booking status",
    //     });
    //   }
    // );
  
    // const handleFetchingHotelPerformance = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const hotelId = req.query?.hotelId?.toString();
  
    //     const { monthlyRevenu, yearlyRevenu, totalBookings } =
    //       await getHotelPerformance(hotelId, bookingRepo);
  
    //     res.status(HttpStatus.OK).json({
    //       status: "success",
    //       message: "successfully fetched performance",
    //       monthlyRevenu,
    //       yearlyRevenu,
    //       totalBookings,
    //     });
    //   }
    // );
  
    // const handleGetBookingDetailsOfUser = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const { id } = req.params;
    //     const bookingDetails = await fetchUserBooking(id, bookingRepo);
    //     res.status(HttpStatus.OK).json({
    //       status: "success",
    //       message: "Successfully fetched data",
    //       bookingDetails: bookingDetails[0],
    //     });
    //   }
    // );
  
    // const handleFetchingChartsDatas = expressAsyncHandler(
    //   async (req: Request, res: Response, next: NextFunction) => {
    //     const { hotelId } = req.params;
    //     console.log("charts", hotelId);
    //     const data = await getChartsData(hotelId, bookingRepo);
    //     res.status(HttpStatus.OK).json({status:"success", message:"successfully fetched data", ...data})
    //   }
    // );
  
    return {
      handleBooking,
      // handleGetAllBookingsOfUser,
      // handleCancelBooking,
      // handleGettingAllBookingOfHotel,
      // handleFetchingBookingDetails,
      // handleStatsuChange,
      // handleFetchingHotelPerformance,
      // handlePayment,
      // handleGetBookingDetailsOfUser,
      // handleFetchingChartsDatas,
    };
  }