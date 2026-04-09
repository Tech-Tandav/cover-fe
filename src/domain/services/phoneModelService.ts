import { IPhoneModel, IPhoneModelApi } from "../interfaces/phoneModelInterface";
import { IPaginatedApi } from "../interfaces/apiResponse";
import { phoneModelApiRepository } from "../apiRepository/phoneModelApiRepository";
import { mapPhoneModel } from "../mappers/phoneModelMapper";

const unwrap = (data: unknown): IPhoneModelApi[] => {
  if (Array.isArray(data)) return data as IPhoneModelApi[];
  return ((data as IPaginatedApi<IPhoneModelApi[]>).results ?? []) as IPhoneModelApi[];
};

export const phoneModelService = {
  getPhoneModels: async (brandSlug?: string): Promise<IPhoneModel[]> => {
    try {
      const res = await phoneModelApiRepository.list(brandSlug);
      return unwrap(res.data).map(mapPhoneModel);
    } catch (e) {
      console.error("Failed to get phone models:", e);
      return [];
    }
  },

  createPhoneModel: async (
    name: string,
    brandId: string | number
  ): Promise<IPhoneModel> => {
    const res = await phoneModelApiRepository.create(name, brandId);
    return mapPhoneModel(res.data as IPhoneModelApi);
  },
};
