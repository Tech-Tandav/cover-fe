import { IVariant, IVariantApi } from "../interfaces/variantInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { variantApiRepository } from "../apiRepository/variantApiRepository";
import { mapVariant } from "../mappers/variantMapper";

const unwrap = (data: unknown): IVariantApi[] => {
  if (Array.isArray(data)) return data as IVariantApi[];
  return ((data as IPaginatedApi<IVariantApi[]>).results ?? []) as IVariantApi[];
};

export const variantService = {
  getVariants: async (modelId?: string | number): Promise<IVariant[]> => {
    try {
      const res = await variantApiRepository.list(modelId);
      return unwrap(res.data).map(mapVariant);
    } catch (e) {
      console.error("Failed to get variants:", e);
      return [];
    }
  },

  createVariant: async (
    name: string,
    modelId: string | number
  ): Promise<IVariant> => {
    const res = await variantApiRepository.create(name, modelId);
    return mapVariant(res.data as IVariantApi);
  },
};
