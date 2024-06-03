import mongoose, { mongo } from "mongoose";
import { bookingEntityType } from "../../entites/booking";
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB";

export default function bookingDbInterface(
  repository: ReturnType<bookingDbRepositoryType>
) {
  const createBooking = async (bookingEntity: bookingEntityType) =>
    await repository.createBooking(bookingEntity);

  const getAllBooking = async () => await repository.getAllBooking();

  const getBooking = async (bookingId: string) =>
    await repository.getBooking(bookingId);

  const deleteBooking = async (bookingId: string) =>
    await repository.deleteBooking(bookingId);

  const updateBooking = async (bookingId: string, updates: any) =>
    await repository.updateBooking(bookingId, updates);

  return {
    createBooking,
    getAllBooking,
    getBooking,
    deleteBooking,
    updateBooking,
  };
}

export type bookingDbInterfaceType = typeof bookingDbInterface;