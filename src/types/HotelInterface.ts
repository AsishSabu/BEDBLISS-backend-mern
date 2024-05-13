export interface HotelInterface {
  name: string;
  email: string;
  ownerId: string;
  place: string;
  description: string;
  propertyRules: string[];
  aboutProperty: string;
  rooms: {
    type: "single" | "double" | "duplex";
    price: string;
    guests: string;
    number: string;
  }[];
  amenities: string[];
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
