import mongoose from 'mongoose';

interface Address {
  streetAddress: string;
  landMark: string;
  district: string;
  city: string;
  pincode: string;
  country: string;
}

export interface RoomInterface {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  price: number;
  maxAdults: number;
  maxChildren: number;
  desc: string;
  roomNumbers: { number: number; unavailableDates: Date[] }[];
}

// Hotel interface
export interface HotelInterface {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  destination: string;
  description: string;
  propertyRules: string[];
  reservationType: string;
  stayType: string;
  amenities: string[];
  isBlocked: boolean;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  address: Address;
  ownerDocument: string;
  hotelDocument: string;
  ownerPhoto: string;
  unavailbleDates: Date[];
  rooms: RoomInterface[];
}

export interface Options {
  adult: number;
  children: number;
  room: number;
}
export interface Dates {
  startDate: string;
  endDate: string;
  
};

export interface optionType {
  adult: number
  children: number
  room: number
}