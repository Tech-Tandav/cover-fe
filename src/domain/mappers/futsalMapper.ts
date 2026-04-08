import {
  IFutsal,
  IFutsalApi,
} from "@/domain/interfaces/futsalInterface";


// futsal mapping
export const mapFutsal = (futsal: IFutsalApi): IFutsal => ({
  id: futsal.id,
  name: futsal.name,
  address: futsal.address,
  city: futsal.city,
  latitude: futsal.latitude,
  longitude: futsal.longitude,
  pricePerHour: futsal.price_per_hour,
  amenities: futsal.amenities,
  isActive: futsal.is_active,
  imageUrl: futsal.image,
  images: futsal.images.map((img)=>({
    id:img.id,
    imageUrl:img.image,
  })),
  createdAt: futsal.created_at,
  distance:futsal.distance,
  mapSource:futsal.map_source,
  phone:futsal.phone
});