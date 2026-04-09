import { instance } from "@/lib/axios/axiosInstance";

export const categoryApiRepository = {
  list: () => instance.get("catalog/categories/"),
  retrieve: (slug: string) => instance.get(`catalog/categories/${slug}/`),
};
