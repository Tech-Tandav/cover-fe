import { userApiRepository } from "@/domain/apiRepository/userApiRepository";
import { IUser } from "@/domain/interfaces/userInterface";

export const userService = {
  meUser: async (): Promise<IUser | null> => {
    try {
      const response = await userApiRepository.meUser();
      if (response?.status !== 200) return null;
      const rawData = response.data;
      return {
        username: rawData.username,
        email: rawData.email,
        isStaff: rawData.is_staff,
        name: rawData.name,
      };
    } catch (e) {
      console.error("Failed to me User: ", e);
      throw e;
    }
  },
};
