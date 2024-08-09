import mongoose from "mongoose"
import { bookingEntityType } from "../../../entites/booking"
import Booking from "../models/bookingModel"
import Report from "../models/reportModel"
import { ReportingEntityType } from "../../../entites/reporting"

export default function bookingDbRepository() {
  const createBooking = async (bookingEntity: bookingEntityType) => {
    try {
      const data = new Booking({
        firstName: bookingEntity.getFirstName(),
        lastName: bookingEntity.getLastName(),
        phoneNumber: bookingEntity.getPhoneNumber(),
        email: bookingEntity.getEmail(),
        hotelId: bookingEntity.getHotelId(),
        userId: bookingEntity.getUserId(),
        maxAdults: bookingEntity.getMaxAdults(),
        maxChildren: bookingEntity.getMaxChildren(),
        checkInDate: bookingEntity.getCheckInDate(),
        checkOutDate: bookingEntity.getCheckOutDate(),
        totalDays: bookingEntity.getTotalDays(),
        totalRooms: bookingEntity.getTotalRooms(),
        price: bookingEntity.getPrice(),
        platformFee:bookingEntity.getPlatformFee(),
        rooms: bookingEntity.getRooms(),
        paymentMethod: bookingEntity.getPaymentMethod(),
      })
      await data.save()

      return data
    } catch (error) {
      throw new Error("Error creating booking")
    }
  }

  const getAllBooking = async () => {
    try {
      const bookings = await Booking.find()
        .sort({ updatedAt: -1 })
        .populate("userId")
        .populate("hotelId")
      return bookings
    } catch (error) {
      throw new Error("Error fetching all bookings")
    }
  }

  const getBookingById = async (id: string) => {
    try {
      const booking = await Booking.findById(id)
        .populate("userId") // Populate userId field
        .populate("hotelId") // Populate hotelId field
        .populate("hotelId.ownerId") // Populate ownerId field of hotelId

      return booking
    } catch (error) {
      console.error("Error fetching booking by ID:", error)
      throw new Error("Error fetching booking by ID")
    }
  }

  const getBookingBybookingId = async (id: string) => {
    try {
      const booking = await Booking.findOne({ bookingId: id })
        .populate("userId")
        .populate("hotelId")
        .populate("hotelId.ownerId")
      return booking
    } catch (error) {
      throw new Error("Error fetching booking by booking ID")
    }
  }

  const getBookingByuser = async (id: string) => {
    try {
      const bookings = await Booking.find({ userId: id })
        .populate("userId")
        .populate("hotelId")
        .populate("hotelId.ownerId")
        .sort({ createdAt: -1 })
      return bookings
    } catch (error) {
      throw new Error("Error fetching bookings by user ID")
    }
  }

  const getBookingByHotel = async (id: string) => {
    try {
      const bookings = await Booking.find({ hotelId: id })
        .populate("userId")
        .populate("hotelId")
        .populate("hotelId.ownerId")
      return bookings
    } catch (error) {
      throw new Error("Error fetching bookings by hotel ID")
    }
  }

  const getBookingByHotels = async (ids: string[]) => {
    try {
      const bookings = await Booking.find({ hotelId: { $in: ids } })
        .populate("userId")
        .populate("hotelId")
        .populate("hotelId.ownerId").sort({createdAt:-1})
      return bookings
    } catch (error) {
      throw new Error("Error fetching bookings by hotel IDs")
    }
  }

  const deleteBooking = async (id: string) => {
    try {
      const deletedBooking = await Booking.findByIdAndUpdate(
        id,
        { $set: { status: "cancelled" } },
        { new: true }
      )
      return deletedBooking
    } catch (error) {
      throw new Error("Error deleting booking")
    }
  }

  const updateBooking = async (
    bookingId: string,
    updatingData: Record<any, any>
  ) => {
    try {
      const updatedBooking = await Booking.findOneAndUpdate(
        { bookingId },
        updatingData,
        { new: true, upsert: true }
      ).populate({
        path: "hotelId",
        populate: {
          path: "ownerId",
        },
      })
      return updatedBooking
    } catch (error) {
      throw new Error("Error updating booking")
    }
  }

  const addReporting = async (reportingData: ReportingEntityType) =>
    await Report.create({
      userId: reportingData.getUserId(),
      hotelId: reportingData.getHotelId(),
      bookingId: reportingData.getBookingId(),
      reason: reportingData.getReason(),
    })

  const getReportings = async () =>
    await Report.find()
      .populate("userId")
      .populate("hotelId")
      .populate("bookingId")

  const getReportingsByFilter = async (id: string) =>
    await Report.findById(id)
      .populate("userId")
      .populate("hotelId")
      .populate("bookingId")

  const updateReporting = async (
    reportingId: string,
    updatingData: Record<any, any>
  ) =>
    await Report.findByIdAndUpdate(reportingId, updatingData, {
      new: true,
      upsert: true,
    })

  return {
    createBooking,
    getAllBooking,
    getBookingByuser,
    deleteBooking,
    updateBooking,
    getBookingById,
    getBookingByHotel,
    getBookingBybookingId,
    getBookingByHotels,
    addReporting,
    getReportings,
    getReportingsByFilter,
    updateReporting,
  }
}
export type bookingDbRepositoryType = typeof bookingDbRepository
