import { IBrand, IBrandApi } from "../interfaces/brandInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { brandApiRepository } from "../apiRepository/brandApiRepository";
import { mapBrand } from "../mappers/brandMapper";

const unwrap = (data: unknown): IBrandApi[] => {
  if (Array.isArray(data)) return data as IBrandApi[];
  return ((data as IPaginatedApi<IBrandApi[]>).results ?? []) as IBrandApi[];
};

export const brandService = {
  getBrands: async (categorySlug?: string): Promise<IBrand[]> => {
    try {
      const res = await brandApiRepository.list(categorySlug);
      return unwrap(res.data).map(mapBrand);
    } catch (e) {
      console.error("Failed to get brands:", e);
      return [];
    }
  },

  createBrand: async (
    name: string,
    categoryIds: (string | number)[] = []
  ): Promise<IBrand> => {
    const res = await brandApiRepository.create(name, categoryIds);
    return mapBrand(res.data as IBrandApi);
  },
};
