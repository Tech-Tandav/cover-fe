import { instance } from "@/lib/axios/axiosInstance";

export const userApiRepository = {
  // getusers: async () => {
  //   try {
  //     return await instance.get("users/");
  //   } catch (e) {
  //     console.error("Failed to get users: ", e);
  //     throw e;
  //   }
  // },

  // retrieveuser: async (id: number) => {
  //   try {
  //     return await instance.get(`users/${id}/`);
  //   } catch (e) {
  //     console.error("Failed to retrieve user: ", e);
  //     throw e;
  //   }
  // },

  // createuser: async (data: any) => {
  //   try {
  //     return await instance.post("users/", data);
  //   } catch (e) {
  //     console.error("Failed to create user: ", e);
  //     throw e;
  //   }
  // },

  // updateuserStatus: async (id: number, data: { status: string }) => {
  //   try {
  //     return await instance.patch(`users/${id}/`, data);
  //   } catch (e) {
  //     console.error("Failed to update user: ", e);
  //     throw e;
  //   }
  // },

  // deleteuser: async (id: number) => {
  //   try {
  //     return await instance.delete(`users/${id}/`);
  //   } catch (e) {
  //     console.error("Failed to delete user: ", e);
  //     throw e;
  //   }
  // },
  meUser: async () => {
    try {
      return await instance.get(`users/me`);
    } catch (e) {
      console.error("Failed to me user: ", e);
      throw e;
    }
  },
};
