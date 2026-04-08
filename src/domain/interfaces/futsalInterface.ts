// --------------------------
// Futsal API interfaces
// --------------------------
export interface IFutsalImageApi {
  id: string;
  image: string;
}

export interface IFutsalApi {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  price_per_hour: number;
  amenities: string[];
  is_active: boolean;
  image: string;
  images: IFutsalImageApi[];
  created_at: string;
  distance:number;
  map_source:string;
  phone:string
}

// --------------------------
// Futsal frontend interface
// --------------------------
export interface IFutsalImage {
  id: string;
  imageUrl: string;
}

export interface IFutsal {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  pricePerHour: number;
  amenities: string[];
  isActive: boolean;
  imageUrl: string;
  images: IFutsalImage[];
  createdAt: string;
  distance:number;
  mapSource:string;
  phone:string
}