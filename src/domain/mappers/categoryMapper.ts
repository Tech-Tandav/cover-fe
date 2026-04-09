import { ICategory, ICategoryApi } from "../interfaces/categoryInterface";

export const mapCategory = (api: ICategoryApi): ICategory => ({
  id: String(api.id),
  name: api.name,
  slug: api.slug,
  description: api.description ?? "",
  icon: api.icon ?? "",
  image: api.image ?? "",
  productCount: api.product_count ?? 0,
  isFeatured: !!api.is_featured,
});
