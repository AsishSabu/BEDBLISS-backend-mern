export const hotelService = () => {
  const createDateArray = (startDate: string, endDate: string): string[] => {
    const currentDate = new Date(startDate);
    const datesArray: string[] = [];
  
    while (currentDate <= new Date(endDate)) {
      datesArray.push(currentDate.toISOString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return datesArray;
  };
  return{
    createDateArray
  }
}

export type HotelServiceType = typeof hotelService
export type HotelServiceReturnType = ReturnType<HotelServiceType>
