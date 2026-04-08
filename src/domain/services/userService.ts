import { userApiRepository } from "@/domain/apiRepository/userApiRepository";
import { IUserApi, IUser } from "@/domain/interfaces/userInterface";
// import { mapUser } from "@/mappers/userMapper";

export const userService = {
//   getUsers: async (): Promise<IUser[]> => {
//     try {
//       const response = await UserApiRepository.getUsers();
//       if (response?.status !== 200) return [];
//       const rawData: IUserApi[] = response.data;
//       return rawData.map(mapUser);
//     } catch (e) {
//       console.error("Failed to get Users: ", e);
//       return [];
//     }
//   },

//   retrieveUser: async (id: number): Promise<IUser | undefined> => {
//     try {
//       const response = await UserApiRepository.retrieveUser(id);
//       if (response?.status !== 200) return;
//       return mapUser(response.data);
//     } catch (e) {
//       console.error("Failed to retrieve User: ", e);
//     }
//   },

//   createUser: async (data: any) => {
//     try {
//       const response = await UserApiRepository.createUser(data);
//       return response.data;
//     } catch (e) {
//       console.error("Failed to create User: ", e);
//     }
//   },

//   updateUserStatus: async (id: number, status: string) => {
//     try {
//       const response = await UserApiRepository.updateUserStatus(id, { status });
//       return mapUser(response.data);
//     } catch (e) {
//       console.error("Failed to update User status: ", e);
//     }
//   },

//   deleteUser: async (id: number) => {
//     try {
//       await UserApiRepository.deleteUser(id);
//     } catch (e) {
//       console.error("Failed to delete User: ", e);
//     }
//   },
    meUser: async ():Promise<IUser | null> => {
        try {
            const response = await userApiRepository.meUser();
            console.log(response)
            if (response?.status !== 200) return null;
            const rawData = response.data;
            const  mappedData  ={
                username: rawData.username,
                email: rawData.email,
                isStaff: rawData.is_staff,
                name: rawData.name
            }
            return mappedData
        } catch (e) {
            console.error("Failed to me User: ", e);
            throw e
        }
        },
};
