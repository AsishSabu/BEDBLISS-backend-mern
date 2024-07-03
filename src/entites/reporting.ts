export default function reportingEntity(
    userId: string,
    hotelId: string,
    bookingId: string,
    reason: string,

  ) {
    return {
      getUserId: (): string => userId,
      getHotelId: (): string => hotelId,
      getBookingId: ():string => bookingId,
      getReason: (): string => reason,
    };
  }
  export type ReportingEntityType = ReturnType<typeof reportingEntity>;