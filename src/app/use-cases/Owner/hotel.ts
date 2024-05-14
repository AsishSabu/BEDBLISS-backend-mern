import createHotelEntity, { HotelEntityType } from "../../../entites/hotel";
import Hotel from "../../../frameworks/database/models/hotelModel";
import { HttpStatus } from "../../../types/httpStatus";
import AppError from "../../../utils/appError";
import { hotelDbInterfaceType } from "../../interfaces/hotelDbInterface";
import { HotelInterface } from "./../../../types/HotelInterface";

export const addHotel = async (
  ownerId:string,
  hotel: HotelInterface,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const {
    name,
    email,
    place,
    description,
    propertyRules,
    aboutProperty,
    rooms,
    amenities,
  } = hotel;
  const existingHotel = await hotelRepository.getHotelByName(name);
  const existingEmail = await hotelRepository.getHotelByEmail(email);
  if (existingHotel) {
    throw new AppError(
      "Hotel with this name already exists",
      HttpStatus.UNAUTHORIZED
    );
  }
  if (existingEmail) {
    throw new AppError(
      "Email with this email already exists",
      HttpStatus.UNAUTHORIZED
    );
  }
  const hotelEntity: HotelEntityType = createHotelEntity(
    name,
    email,
    ownerId,
    place,
    description,
    propertyRules,
    aboutProperty,
    rooms,
    amenities
  );

  const newHotel = await hotelRepository.addHotel(hotelEntity);

  return newHotel;
};
