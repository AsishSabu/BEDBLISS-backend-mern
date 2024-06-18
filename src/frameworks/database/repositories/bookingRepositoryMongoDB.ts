import mongoose from "mongoose"
import { bookingEntityType } from "../../../entites/booking"
import Booking from "../models/bookingModel"

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
        checkInDate: bookingEntity.getCheckInDate(),
        checkOutDate: bookingEntity.getCheckOutDate(),
        totalDays: bookingEntity.getTotalDays(),
        price: bookingEntity.getPrice(),
        rooms: bookingEntity.getRooms(),
        paymentMethod: bookingEntity.getPaymentMethod(),
      });

      console.log("hlooooo");

      await data.save();

      return data;
    } catch (error) {
      throw new Error("Error creating booking");
    }
  };

  const getAllBooking = async () => {
    try {
      const bookings = await Booking.find();
      return bookings;
    } catch (error) {
      throw new Error("Error fetching all bookings");
    }
  };

  const getBookingById = async (id: string) => {
    try {
      const booking = await Booking.findById(id).populate("userId").populate("hotelId");
      return booking;
    } catch (error) {
      throw new Error("Error fetching booking by ID");
    }
  };

  const getBookingBybookingId = async (id: string) => {
    try {
      const booking = await Booking.findOne({ bookingId: id }).populate("userId").populate("hotelId");
      return booking;
    } catch (error) {
      throw new Error("Error fetching booking by booking ID");
    }
  };

  const getBookingByuser = async (id: string) => {
    try {
      const bookings = await Booking.find({ userId: id }).populate("userId").populate("hotelId").sort({ createdAt: -1 });
      return bookings;
    } catch (error) {
      throw new Error("Error fetching bookings by user ID");
    }
  };

  const getBookingByHotel = async (id: string) => {
    try {
      const bookings = await Booking.find({ hotelId: id }).populate("userId").populate("hotelId");
      return bookings;
    } catch (error) {
      throw new Error("Error fetching bookings by hotel ID");
    }
  };

  const getBookingByHotels = async (ids: string[]) => {
    try {
      const bookings = await Booking.find({ hotelId: { $in: ids } }).populate("userId").populate("hotelId");
      return bookings;
    } catch (error) {
      throw new Error("Error fetching bookings by hotel IDs");
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const deletedBooking = await Booking.findByIdAndUpdate(
        id,
        { $set: { status: "cancelled" } },
        { new: true }
      );
      return deletedBooking;
    } catch (error) {
      throw new Error("Error deleting booking");
    }
  };

  const updateBooking = async (bookingId: string, updatingData: Record<any, any>) => {
    try {
      const updatedBooking = await Booking.findOneAndUpdate(
        { bookingId },
        updatingData,
        { new: true, upsert: true }
      );
      return updatedBooking;
    } catch (error) {
      throw new Error("Error updating booking");
    }
  };

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
  };
}
export type bookingDbRepositoryType = typeof bookingDbRepository