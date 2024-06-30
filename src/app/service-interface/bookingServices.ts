import { BookingServiceReturnType } from "../../frameworks/services/bookingService"

export const bookingServiceInterface = (service: BookingServiceReturnType) => {
  const dateDifference = async (
    date1: string | number | Date,
    date2: string | number | Date
  ) => service.DateDifference(date1, date2)
  return {
    dateDifference
  }
}
export type BookingServiceInterface = typeof bookingServiceInterface
