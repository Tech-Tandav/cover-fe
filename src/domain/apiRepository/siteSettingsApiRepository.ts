import { instance } from "@/lib/axios/axiosInstance";

export const siteSettingsApiRepository = {
  retrieve: () => instance.get("site/settings/"),
};
