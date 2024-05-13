import { HotelInterface } from './../../../types/HotelInterface';
import { HotelEntityType } from "../../../entites/hotel"
import Hotel from "../models/hotelModel"

export const hotelDbRepository=()=>{
    const addHotel=async(hotel:HotelEntityType)=>{
        const newHotel:any=new Hotel({
         name:hotel.getName(),
            email:hotel.getEmail(),
            place:hotel.getPlace(),
            ownerId:hotel.getOwnerId(),
            description:hotel.getDescription(),
            propertyRules:hotel.getPropertyRules(),
            aboutProperty:hotel.getAboutProperty(),
            rooms:hotel.getRooms(),
            amenities:hotel.getAmenities()
        })
        newHotel.save();
        return newHotel
    }
    const getHotelByName=async(name:string)=>{
        const hotel:HotelInterface|null=await Hotel.findOne({name})
        return hotel
    }
    const getHotelEmail = async (email: string) => {
        const user: HotelInterface| null = await Hotel.findOne({ email });
        return user;
      };
    return{
        addHotel,
        getHotelByName,
        getHotelEmail
    }
}
export type hotelDbRepositoryType=typeof hotelDbRepository;