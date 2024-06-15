import mongoose from 'mongoose';

export interface RoomInterface {
  _id: string;
  title: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  desc: string;
  roomNumbers: number[];  // roomNumbers as array of numbers
  createdAt: Date;
  updatedAt: Date;
}
