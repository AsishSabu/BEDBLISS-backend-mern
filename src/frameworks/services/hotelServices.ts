export const hotelService = () => {
  const createDateArray = (startDate: string, endDate: string): string[] => {
    console.log(startDate,endDate,"date reached in hotel SErvice")

    const currentDate = new Date(startDate)
    const end = new Date(endDate)
    const datesArray: string[] = []

    while (currentDate <= end) {
      const formattedDate = new Date(currentDate)
      formattedDate.setUTCHours(0, 0, 0, 0)
      datesArray.push(formattedDate.toISOString())
      currentDate.setDate(currentDate.getDate() + 1)
    }
    console.log(datesArray, "datesArray")

    return datesArray
  }
  return {
    createDateArray,
  }
}

export type HotelServiceType = typeof hotelService
export type HotelServiceReturnType = ReturnType<HotelServiceType>
