import mongoose from "mongoose";

export default function hotelEntity(
  ownerId: mongoose.Types.ObjectId,
  name: string,
  destination: string,
  stayType: string,
  description: string,
  propertyRules: string[],
  room: string,
  bed: string,
  bathroom: string,
  guests: string,
  amenities: string[],
  imageUrls: string[],
  reservationType: string,
  address: {
    streetAddress: string;
    landMark: string;
    district: string;
    city: string;
    pincode: string;
    country: string,
  }
) {
  return {
    getName: (): string => name,
    getOwnerId: (): mongoose.Types.ObjectId => ownerId,
    getDestination: (): string => destination,
    getStayType: (): string => stayType,
    getDescription: (): string => description,
    getPropertyRules: (): string[] => propertyRules,
    getRoom: (): string => room,
    getBed: (): string => bed,
    getBathroom: (): string => bathroom,
    getGuests: (): string => guests,
    getReservationType: (): string => reservationType,
    getAmenities: (): string[] => amenities,
    getImageUrls: (): string[] => imageUrls,
    getAddress: () => address,
  };
}

export type HotelEntityType = ReturnType<typeof hotelEntity>;
