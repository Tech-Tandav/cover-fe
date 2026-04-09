export interface IProductImageApi {
  id: number | string;
  image: string;
  alt: string;
}

export interface IProductApi {
  id: number | string;
  name: string;
  slug: string;
  brand: string;
  brand_slug: string;
  category: string;
  category_slug: string;
  variants: string[];
  material: string;
  colors: string[];
  sizes: string[];
  price: number | string;
  discount_price: number | string | null;
  stock: number;
  description: string;
  image: string;
  images: IProductImageApi[];
  rating: number | string;
  review_count: number;
  hot_sale_live: boolean;
  is_new: boolean;
  created_at: string;
}

export interface IProductImage {
  id: string;
  imageUrl: string;
  alt: string;
}

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  variants: string[];
  material: string;
  colors: string[];
  sizes: string[];
  price: number;
  discountPrice: number | null;
  finalPrice: number;
  stock: number;
  inStock: boolean;
  description: string;
  imageUrl: string;
  images: IProductImage[];
  rating: number;
  reviewCount: number;
  hotSaleLive: boolean;
  isNew: boolean;
  createdAt: string;
}
