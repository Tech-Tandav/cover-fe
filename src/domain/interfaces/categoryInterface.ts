export interface ICategoryApi {
  id: number | string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  product_count: number;
  is_featured: boolean;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
  isFeatured: boolean;
}
