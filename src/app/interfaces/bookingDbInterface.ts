import mongoose, { mongo } from "mongoose"
import { bookingEntityType } from "../../entites/booking"
import { bookingDbRepositoryType } from "../../frameworks/database/repositories/bookingRepositoryMongoDB"
import { ReportingEntityType } from "../../entites/reporting"

export default function bookingDbInterface(
  repository: ReturnType<bookingDbRepositoryType>
) {
  const createBooking = async (bookingEntity: bookingEntityType) =>
    await repository.createBooking(bookingEntity)

  const getAllBooking = async () => await repository.getAllBooking()

  const getBooking = async (bookingId: string) =>
    await repository.getBookingByuser(bookingId)

  const getBookingById = async (bookingId: string) =>
    await repository.getBookingById(bookingId)

    const getBookingsBybookingId = async (bookingId: string) =>
    await repository.getBookingBybookingId(bookingId)

  const getBookingByHotel = async (bookingId: string) =>
    await repository.getBookingByHotel(bookingId)


  const deleteBooking = async (bookingId: string) =>
    await repository.deleteBooking(bookingId)

  const updateBooking = async (bookingId: string, updates: any) =>
    await repository.updateBooking(bookingId, updates)

  const getBookingByHotels = async (bookingId: string[]) =>
    await repository.getBookingByHotels(bookingId)

  const addReporting = async (reportingData:ReportingEntityType) =>
    await repository.addReporting(reportingData);

  const getReportings = async () =>
    await repository.getReportings();

  const getReportingsByFilter = async (id:string) =>
    await repository.getReportingsByFilter(id);

  const updateReporting = async (reportId: string, updates: any) =>
    await repository.updateReporting(reportId, updates)
  


  return {
    createBooking,
    getAllBooking,
    getBooking,
    deleteBooking,
    updateBooking,
    getBookingById,
    getBookingByHotel,
    getBookingsBybookingId,
    getBookingByHotels,
    addReporting,
    getReportings,
    getReportingsByFilter,
    updateReporting

  }
}

export type bookingDbInterfaceType = typeof bookingDbInterface
