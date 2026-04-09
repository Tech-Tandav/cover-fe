import { instance } from "@/lib/axios/axiosInstance";

export const variantApiRepository = {
  list: (modelId?: string | number) =>
    instance.get("catalog/variants/", {
      params: modelId ? { model: modelId } : undefined,
    }),

  create: (name: string, modelId: string | number) =>
    instance.post("catalog/variants/", { name, model: modelId }),
};
