import { ICategory, ICategoryApi } from "../interfaces/categoryInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { categoryApiRepository } from "../apiRepository/categoryApiRepository";
import { mapCategory } from "../mappers/categoryMapper";

export const categoryService = {
  getCategories: async (): Promise<ICategory[]> => {
    try {
      const res = await categoryApiRepository.list();
      const data = res.data as IPaginatedApi<ICategoryApi[]> | ICategoryApi[];
      const items = Array.isArray(data) ? data : data.results;
      return items.map(mapCategory);
    } catch (e) {
      console.error("Failed to get categories:", e);
      return [];
    }
  },

  getFeaturedCategories: async (): Promise<ICategory[]> => {
    const all = await categoryService.getCategories();
    return all.filter((c) => c.isFeatured);
  },

  retrieveCategory: async (slug: string): Promise<ICategory | null> => {
    try {
      const res = await categoryApiRepository.retrieve(slug);
      return mapCategory(res.data as ICategoryApi);
    } catch (e) {
      console.error("Failed to retrieve category:", e);
      return null;
    }
  },
};
