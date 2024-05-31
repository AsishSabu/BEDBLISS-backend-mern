import mongoose from 'mongoose';

export interface HotelInterface {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  destination: string;
  description: string;
  propertyRules: string[];
  room: number;
  bed: number;
  bathroom: number;
  guests: number;
  reservationType: string;
  stayType: string;
  amenities: string[];
  isBlocked: boolean;
  isListed: boolean;
  createdAt: Date;
  updatedAt: Date;
  imageUrls: string[];
  address: {
    streetAddress: string;
    landMark: string;
    district: string;
    city: string;
    pincode: string;
    country: string;
  };
  ownerDocument:string;
  hotelDocument:string;
  ownerPhoto:string;
  unavailbleDates: Date[];
}