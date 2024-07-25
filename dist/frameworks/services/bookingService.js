"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingService = void 0;
const bookingService = () => {
    const DateDifference = (date1, date2) => __awaiter(void 0, void 0, void 0, function* () {
        // Ensure the dates are defined before creating new Date objects
        const Date1 = new Date(date1 !== null && date1 !== void 0 ? date1 : 0);
        const Date2 = new Date(date2 !== null && date2 !== void 0 ? date2 : 0);
        if (!isNaN(Date1.getTime()) && !isNaN(Date2.getTime())) {
            const differenceInMilliseconds = Date2.getTime() - Date1.getTime();
            const differenceInDays = Math.abs(Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24)));
            console.log(differenceInDays);
            return differenceInDays;
        }
        else {
            console.error("Invalid date(s) found:", Date1, Date2);
            return undefined;
        }
    });
    return {
        DateDifference,
    };
};
exports.bookingService = bookingService;
