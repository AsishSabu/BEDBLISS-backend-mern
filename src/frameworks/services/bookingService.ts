export const bookingService = () => {
  const DateDifference = async (
    date1: string | number | Date,
    date2: string | number | Date
  ): Promise<number | undefined> => {
    // Ensure the dates are defined before creating new Date objects
    const Date1 = new Date(date1 ?? 0)
    const Date2 = new Date(date2 ?? 0)

    if (!isNaN(Date1.getTime()) && !isNaN(Date2.getTime())) {
      const differenceInMilliseconds = Date2.getTime() - Date1.getTime()
      const differenceInDays = Math.abs(
        Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24))
      )
      console.log(differenceInDays)
      return differenceInDays
    } else {
      console.error("Invalid date(s) found:", Date1, Date2)
      return undefined
    }
  }

  return {
    DateDifference,
  }
}

export type BookingServiceType = typeof bookingService
export type BookingServiceReturnType = ReturnType<BookingServiceType>
