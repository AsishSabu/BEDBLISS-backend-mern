"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDates = void 0;
const getDates = (startDate, endDate) => {
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    const datesArray = [];
    while (currentDate <= end) {
        const formattedDate = new Date(currentDate);
        formattedDate.setUTCHours(0, 0, 0, 0);
        datesArray.push(formattedDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return datesArray;
};
exports.getDates = getDates;
