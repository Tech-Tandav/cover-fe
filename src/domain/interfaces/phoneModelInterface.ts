export interface IPhoneModelApi {
  id: number | string;
  name: string;
  slug: string;
  brand: number | string;
  brand_slug: string;
  brand_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface IPhoneModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  brandSlug: string;
  brandName: string;
  sortOrder: number;
  isActive: boolean;
}
