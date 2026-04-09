import { IBrand, IBrandApi } from "../interfaces/brandInterface";

export const mapBrand = (api: IBrandApi): IBrand => ({
  id: String(api.id),
  name: api.name,
  slug: api.slug,
  logo: api.logo,
  categorySlugs: api.category_slugs ?? [],
  sortOrder: api.sort_order ?? 0,
  isActive: !!api.is_active,
  productCount: api.product_count ?? 0,
});
