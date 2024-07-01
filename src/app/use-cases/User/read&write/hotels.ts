import mongoose from "mongoose"
import ratingEntity from "../../../../entites/rating"
import { hotelDbInterfaceType } from "../../../interfaces/hotelDbInterface"


export const getUserHotels = async (
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getUserHotels()

export const getHotelDetails = async (
  id: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getHotelDetails(id)

export const viewByDestination = async (
  destination: string,
  adults: string,
  children: string,
  room: string,
  startDate: string,
  endDate: string,
  amenities: string[],
  minPrice: string,
  maxPrice: string,
  categories: string[],
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const data = await hotelRepository.findByDestination(
    destination,
    adults,
    children,
    room,
    startDate,
    endDate,
    amenities,
    minPrice,
    maxPrice,
    categories
  )
  return data
}

export const addNewRating = async (
  userId: string,
  ratingData: { hotelId: string; rating: number; description: string;  imageUrls:string[] },
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => {
  const { hotelId, rating, description,imageUrls } = ratingData;
  const newRatingEntity = ratingEntity(
    userId,
    hotelId,
    rating,
    description,
    imageUrls,
  );

  return await hotelRepository.addRating(newRatingEntity);
};

export const ratings = async (
  hotelID: string,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) => await hotelRepository.getRatings({ hotelId: hotelID });

export const ReviewsByUserId = async (
  userID: string,
  hotelID:mongoose.Types.ObjectId,
  hotelRepository: ReturnType<hotelDbInterfaceType>
) =>
  await hotelRepository.getRatings({
    userId: userID,
    hotelId: hotelID,
  });