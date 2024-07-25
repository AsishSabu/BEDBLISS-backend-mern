"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hotelEntity(ownerId, name, destination, stayType, description, propertyRules, amenities, imageUrls, 
// coordinates: {
//   latitude: number
//   longitude: number
// },
address, ownerDocument, hotelDocument, ownerPhoto) {
    return {
        getName: () => name,
        getOwnerId: () => ownerId,
        getDestination: () => destination,
        getStayType: () => stayType,
        getDescription: () => description,
        getPropertyRules: () => propertyRules,
        // getCordinatesType: () => coordinates,
        getAmenities: () => amenities,
        getImageUrls: () => imageUrls,
        getAddress: () => address,
        getOwnerDocument: () => ownerDocument,
        getHotelDocument: () => hotelDocument,
        getOwnerPhoto: () => ownerPhoto,
    };
}
exports.default = hotelEntity;
