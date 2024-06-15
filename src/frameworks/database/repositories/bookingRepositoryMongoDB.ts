import mongoose from "mongoose"
import { bookingEntityType } from "../../../entites/booking"
import Booking from "../models/bookingModel"

export default function bookingDbRepository() {
  const createBooking = async (bookingEntity: bookingEntityType) => {
    const rooms=bookingEntity.getRooms()
    console.log(rooms,"rooms........................");
    
    
    const data = new Booking({
      firstName: bookingEntity.getFirstName(),
      lastName: bookingEntity.getLastName(),
      phoneNumber: bookingEntity.getPhoneNumber(),
      email: bookingEntity.getEmail(),
      hotelId: bookingEntity.getHotelId(),
      userId: bookingEntity.getUserId(),
      maxAdults: bookingEntity.getMaxAdults(),
      checkInDate: bookingEntity.getCheckInDate(),
      checkOutDate: bookingEntity.getCheckOutDate(),
      totalDays: bookingEntity.getTotalDays(),
      price: bookingEntity.getPrice(),
      paymentMethod: bookingEntity.getPaymentMethod(),
    })
    console.log("hlooooo")

    data.save()

    return {data,rooms}
  }

  const getAllBooking = async () => {
    const bookings = await Booking.find()
    return bookings
  }
  const getBookingById = async (id: string) =>
    await Booking.findById(id).populate("userId").populate("hotelId")

  const getBookingBybookingId = async (id: string) =>
    await Booking.find({ bookingId: id }).populate("userId").populate("hotelId")

  const getBookingByuser = async (id: string) =>
    await Booking.find({ userId: id }).populate("userId").populate("hotelId")

  const getBookingByHotel = async (id: string) =>
    await Booking.find({ hotelId: id }).populate("userId").populate("hotelId")

  const deleteBooking = async (id: string) =>
    await Booking.findByIdAndUpdate(
      id,
      { $set: { status: "cancelled" } },
      { new: true }
    )

  const updateBooking = async (
    bookingId: string,
    updatingData: Record<any, any>
  ) =>
    await Booking.findOneAndUpdate({ bookingId }, updatingData, {
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
    getBookingBybookingId
  }
}
export type bookingDbRepositoryType = typeof bookingDbRepository
