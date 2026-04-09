import { instance } from "@/lib/axios/axiosInstance";
import { IProductFilter } from "@/domain/services/productService";

const buildParams = (filter: IProductFilter): Record<string, string> => {
  const p: Record<string, string> = {};
  if (filter.categorySlug) p["category__slug"] = filter.categorySlug;
  // django-filter `exact` is single-value; only the first selection in each
  // list is sent. Multi-select narrowing is applied in productService on the
  // client. Multi-value `__in` lookups would need backend filterset support.
  if (filter.brands?.length) p["brand__name"] = filter.brands[0];
  if (filter.variants?.length) p["variants__name"] = filter.variants[0];
  if (filter.materials?.length) p["material"] = filter.materials[0];
  if (filter.minPrice != null) p["price__gte"] = String(filter.minPrice);
  if (filter.maxPrice != null) p["price__lte"] = String(filter.maxPrice);
  if (filter.search) p["search"] = filter.search;
  if (filter.sortBy) {
    const map: Record<string, string> = {
      newest: "-created_at",
      "price-asc": "price",
      "price-desc": "-price",
      rating: "-rating",
    };
    p["ordering"] = map[filter.sortBy] ?? "-created_at";
  }
  return p;
};

export const productApiRepository = {
  list: (filter: IProductFilter = {}) =>
    instance.get("catalog/products/", { params: buildParams(filter) }),

  retrieve: (slug: string) => instance.get(`catalog/products/${slug}/`),

  hotSale: () =>
    instance.get("catalog/products/", {
      params: { hot_sale_live: "true", ordering: "-created_at" },
    }),

  newArrivals: () =>
    instance.get("catalog/products/", { params: { is_new: "true" } }),

  create: (payload: FormData) =>
    instance.post("catalog/products/", payload),
};
