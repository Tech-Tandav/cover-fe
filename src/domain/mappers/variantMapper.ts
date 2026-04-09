import { IVariant, IVariantApi } from "../interfaces/variantInterface";

export const mapVariant = (api: IVariantApi): IVariant => ({
  id: String(api.id),
  name: api.name,
  slug: api.slug,
  modelId: String(api.model),
  modelSlug: api.model_slug,
  modelName: api.model_name,
  brandId: String(api.brand_id),
  brandSlug: api.brand_slug,
  brandName: api.brand_name,
  sortOrder: api.sort_order ?? 0,
  isActive: !!api.is_active,
});
