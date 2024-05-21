export default function hotelEntity(
  name: string,
  email: string,
  ownerId:string,
  place: string,
  description: string,
  propertyRules: string[],
  aboutProperty: string,
  rooms: {
    type: 'single' | 'double' | 'duplex';
    price: string;
    number: string;
  }[],
  amenities: string[],
  image:string,
) {
  return {
    getName: (): string => name,
    getEmail: (): string => email,
    getOwnerId: (): string => ownerId,
    getPlace: (): string => place,
    getDescription: (): string => description,
    getPropertyRules: (): string[] => propertyRules,
    getAboutProperty: (): string => aboutProperty,
    getRooms: (): {
      type: 'single' | 'double' | 'duplex';
      price: string;
      number: string;
    }[] => rooms,
    getAmenities: (): string[] => amenities,
    getImage:():string=>image
  };
}

  export type HotelEntityType=ReturnType<typeof hotelEntity>
