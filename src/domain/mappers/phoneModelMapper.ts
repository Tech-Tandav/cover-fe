import { IPhoneModel, IPhoneModelApi } from "../interfaces/phoneModelInterface";

export const mapPhoneModel = (api: IPhoneModelApi): IPhoneModel => ({
  id: String(api.id),
  name: api.name,
  slug: api.slug,
  brandId: String(api.brand),
  brandSlug: api.brand_slug,
  brandName: api.brand_name,
  sortOrder: api.sort_order ?? 0,
  isActive: !!api.is_active,
});
