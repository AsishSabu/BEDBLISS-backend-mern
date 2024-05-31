import mongoose from "mongoose";

export default function hotelEntity(
  ownerId: mongoose.Types.ObjectId,
  name: string,
  destination: string,
  price:string,
  stayType: string,
  description: string,
  propertyRules: string[],
  room: number,
  bed: number,
  bathroom: number,
  guests: number,
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
  },
  ownerDocument:string,
  hotelDocument:string,
  ownerPhoto:string
) {
  return {
    getName: (): string => name,
    getOwnerId: (): mongoose.Types.ObjectId => ownerId,
    getDestination: (): string => destination,
    getStayType: (): string => stayType,
    getDescription: (): string => description,
    getPropertyRules: (): string[] => propertyRules,
    getRoom: (): number => room,
    getBed: (): number => bed,
    getBathroom: (): number => bathroom,
    getGuests: (): number => guests,
    getReservationType: (): string => reservationType,
    getAmenities: (): string[] => amenities,
    getImageUrls: (): string[] => imageUrls,
    getAddress: () => address,
    getOwnerDocument:():string=>ownerDocument,
    getHotelDocument:():string=>hotelDocument,
    getOwnerPhoto:():string=>ownerPhoto,
    getPrice:():string=>price
  };
}

export type HotelEntityType = ReturnType<typeof hotelEntity>;
