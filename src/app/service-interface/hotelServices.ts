import { HotelServiceReturnType } from "../../frameworks/services/hotelServices"

export const hotelServiceInterface = (service: HotelServiceReturnType) => {
  const unavailbleDates = async (startDate: string, endDate: string) =>
    service.createDateArray(startDate, endDate)

  return {
    unavailbleDates,
  }
}
export type HotelServiceInterface = typeof hotelServiceInterface
