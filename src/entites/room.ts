import mongoose from "mongoose";

export default function roomEntity(
  title: string,
  price: number,
  desc: string,
  maxChildren: number,
  maxAdults: number,
  roomNumbers: { number: number }[]
) {
  return {
    getTitle: (): string => title,
    getPrice: (): number => price,
    getDescription: (): string => desc,
    getMaxChildren: (): number => maxChildren,
    getMaxAdults: (): number => maxAdults,
    getRoomNumbers: (): { number: number }[] => roomNumbers,
  };
}

export type RoomEntityType = ReturnType<typeof roomEntity>;
