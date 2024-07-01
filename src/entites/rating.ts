export default function ratingEntity(
    userId: string,
    hotelId: string,
    rating: number,
    description: string,
    imageUrls: string[],
  ) {
    return {
      getUserId: (): string => userId,
      getHotelId: (): string => hotelId,
      getRating: (): number => rating,
      getDescription: (): string => description,
      getImageUrls: (): string[] => imageUrls,
    };
  }
  export type RatingEntityType = ReturnType<typeof ratingEntity>;