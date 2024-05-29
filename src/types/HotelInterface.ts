import mongoose from 'mongoose';

export interface HotelInterface {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  destination: string;
  description: string;
  propertyRules: string[];
  room: string;
  bed: string;
  bathroom: string;
  guests: string;
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
  unavailbleDates: Date[];
}