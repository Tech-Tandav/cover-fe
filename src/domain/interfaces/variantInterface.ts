export interface IVariantApi {
  id: number | string;
  name: string;
  slug: string;
  model: number | string;
  model_slug: string;
  model_name: string;
  brand_id: number | string;
  brand_slug: string;
  brand_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface IVariant {
  id: string;
  name: string;
  slug: string;
  modelId: string;
  modelSlug: string;
  modelName: string;
  brandId: string;
  brandSlug: string;
  brandName: string;
  sortOrder: number;
  isActive: boolean;
}
