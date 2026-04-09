export interface IBrandApi {
  id: number | string;
  name: string;
  slug: string;
  logo: string | null;
  category_slugs: string[];
  sort_order: number;
  is_active: boolean;
  product_count: number;
}

export interface IBrand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  categorySlugs: string[];
  sortOrder: number;
  isActive: boolean;
  productCount: number;
}
