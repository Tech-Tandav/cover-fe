import { ILogin, IRegister } from "@/domain/interfaces/authInterface";
import { authInstance } from "@/lib/axios/authAxiosInstance";


export const authApiRepository = {
    register : async(data:IRegister)=>{
        try{
            return await authInstance.post("register/", data)
        }catch(e){
            console.error("Failed in register api repo: ", e)
            throw e
        }
    },
    login : async(data:ILogin)=>{
        try{
            return await authInstance.post("login/", data)
        }catch(e){
            throw e
        }
    },
}