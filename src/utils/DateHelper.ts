const getDates = (startDate: string, endDate: string): string[] => {
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    const datesArray: string[] = [];

    while (currentDate <= end) {
      const formattedDate = new Date(currentDate);
      formattedDate.setUTCHours(0, 0, 0, 0);
      datesArray.push(formattedDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return datesArray;
  };

export {getDates}