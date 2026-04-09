import { IProduct, IProductApi } from "../interfaces/productInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { productApiRepository } from "../apiRepository/productApiRepository";
import { mapProduct } from "../mappers/productMapper";

export interface IProductFilter {
  categorySlug?: string;
  brands?: string[];
  variants?: string[];
  materials?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "newest" | "price-asc" | "price-desc" | "rating";
  search?: string;
}

const unwrapList = (data: unknown): IProductApi[] => {
  if (Array.isArray(data)) return data as IProductApi[];
  return ((data as IPaginatedApi<IProductApi[]>).results ?? []) as IProductApi[];
};

const applyClientFilters = (
  list: IProduct[],
  filter: IProductFilter
): IProduct[] => {
  let out = list;
  // Variant multi-select isn't a single django-filter param, so combine on the
  // client. Backend already filters on `variants__name` for the first value;
  // we widen here when the user picks more than one.
  if (filter.variants?.length) {
    const wanted = new Set(filter.variants);
    out = out.filter((p) => p.variants.some((v) => wanted.has(v)));
  }
  if (filter.inStockOnly) {
    out = out.filter((p) => p.inStock);
  }
  return out;
};

export const productService = {
  getProducts: async (filter: IProductFilter = {}): Promise<IProduct[]> => {
    try {
      const res = await productApiRepository.list(filter);
      const list = unwrapList(res.data).map(mapProduct);
      return applyClientFilters(list, filter);
    } catch (e) {
      console.error("Failed to get products:", e);
      return [];
    }
  },

  getNewArrivals: async (): Promise<IProduct[]> => {
    try {
      const res = await productApiRepository.newArrivals();
      return unwrapList(res.data).map(mapProduct).slice(0, 8);
    } catch (e) {
      console.error("Failed to get new arrivals:", e);
      return [];
    }
  },

  getHotSaleProducts: async (): Promise<IProduct[]> => {
    try {
      const res = await productApiRepository.hotSale();
      return unwrapList(res.data).map(mapProduct).slice(0, 8);
    } catch (e) {
      console.error("Failed to get hot sale products:", e);
      return [];
    }
  },

  createProduct: async (payload: FormData): Promise<IProduct> => {
    const res = await productApiRepository.create(payload);
    return mapProduct(res.data as IProductApi);
  },

  retrieveProduct: async (slug: string): Promise<IProduct | null> => {
    try {
      const res = await productApiRepository.retrieve(slug);
      return mapProduct(res.data as IProductApi);
    } catch (e) {
      console.error("Failed to retrieve product:", e);
      return null;
    }
  },

  // Filter options are derived from the full product list since the backend
  // doesn't yet expose a /filters endpoint. Cheap enough for our catalog size.
  getFilterOptions: async (categorySlug?: string) => {
    const list = await productService.getProducts(
      categorySlug ? { categorySlug } : {}
    );
    const unique = (arr: string[]) => Array.from(new Set(arr)).sort();
    const prices = list.map((p) => p.finalPrice);
    return {
      brands: unique(list.map((p) => p.brand)),
      variants: unique(list.flatMap((p) => p.variants)),
      materials: unique(list.map((p) => p.material).filter(Boolean)),
      priceRange: {
        min: prices.length ? Math.min(...prices) : 0,
        max: prices.length ? Math.max(...prices) : 10000,
      },
    };
  },
};
