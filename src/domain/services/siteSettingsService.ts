import { siteSettingsApiRepository } from "../apiRepository/siteSettingsApiRepository";
import {
  ISiteSettings,
  ISiteSettingsApi,
} from "../interfaces/siteSettingsInterface";
import { mapSiteSettings } from "../mappers/siteSettingsMapper";

export const siteSettingsService = {
  getSiteSettings: async (): Promise<ISiteSettings | null> => {
    try {
      const res = await siteSettingsApiRepository.retrieve();
      return mapSiteSettings(res.data as ISiteSettingsApi);
    } catch (e) {
      console.error("Failed to get site settings:", e);
      return null;
    }
  },
};
