import { instance } from "@/lib/axios/axiosInstance";

export const brandApiRepository = {
  list: (categorySlug?: string) =>
    instance.get("catalog/brands/", {
      params: categorySlug ? { categories__slug: categorySlug } : undefined,
    }),

  create: (name: string, categoryIds: (string | number)[] = []) =>
    instance.post("catalog/brands/", { name, categories: categoryIds }),
};
