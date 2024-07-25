"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hotelService = void 0;
const hotelService = () => {
    const createDateArray = (startDate, endDate) => {
        console.log(startDate, endDate, "date reached in hotel SErvice");
        const currentDate = new Date(startDate);
        const end = new Date(endDate);
        const datesArray = [];
        while (currentDate <= end) {
            const formattedDate = new Date(currentDate);
            formattedDate.setUTCHours(0, 0, 0, 0);
            datesArray.push(formattedDate.toISOString());
            currentDate.setDate(currentDate.getDate() + 1);
        }
        console.log(datesArray, "datesArray");
        return datesArray;
    };
    return {
        createDateArray,
    };
};
exports.hotelService = hotelService;
