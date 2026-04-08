import { futsalApiRepository } from "@/domain/apiRepository/futsalApiRepository";
import { IFutsalApi, IFutsal, IFutsalImageApi, IFutsalImage } from "@/domain/interfaces/futsalInterface";
import { mapFutsal } from "@/domain/mappers/futsalMapper";
import { IResponseApi } from "../interfaces/apiResponse";
import { ILocation } from "../interfaces/location";
// import { ILocation } from "@/app/page";


export const futsalService = {
  getFutsals: async (page:number,userLocation?:ILocation): Promise<IResponseApi<IFutsal[]>> => {
    try {
      const response = await futsalApiRepository.getFutsals(page,userLocation);
      const apiResponse = response.data;
      const mapData = apiResponse.results.map(mapFutsal);
      return {
        ...apiResponse,
        results:mapData
      }
    }catch (e) {
      console.error("Failed to get futsals: ", e);
      throw e;
    }
  },

  retrieveFutsal: async (id: string, date?:string | null, time_slot?:string): Promise<IFutsal | null> => {
    try {
      const response = await futsalApiRepository.retrieveFutsal(id, date, time_slot);
      if (response?.status !== 200) return null;
      const rawData = response.data;
      return mapFutsal(rawData)
    } catch (e) {
      console.error("Failed to retrieve futsal: ", e);
      throw e
    }
  },

  createFutsal: async (data: any): Promise<any> => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      const response = await futsalApiRepository.createFutsal(formData);
      return response.data;
    } catch (e) {
      console.error("Failed to create futsal: ", e);
    }
  },
  updateFutsal: async (id: string, data: any): Promise<any> => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      const response = await futsalApiRepository.updateFutsal(id, formData);
      return response.data;
    } catch (e) {
      console.error("Failed to update futsal: ", e);
    }
  },
  deleteFutsal: async (id: string) => {
    try {
      await futsalApiRepository.deleteFutsal(id);
    } catch (e) {
      console.error("Failed to delete futsal: ", e);
    }
  },
};
