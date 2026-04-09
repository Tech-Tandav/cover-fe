import { instance } from "@/lib/axios/axiosInstance";

export const phoneModelApiRepository = {
  list: (brandSlug?: string) =>
    instance.get("catalog/phone-models/", {
      params: brandSlug ? { brand__slug: brandSlug } : undefined,
    }),

  create: (name: string, brandId: string | number) =>
    instance.post("catalog/phone-models/", { name, brand: brandId }),
};
