import { authApiRepository } from "@/domain/apiRepository/authApiRepository";
import { ILogin, IRegister } from "@/domain/interfaces/authInterface";


export const authServices = {
    register : async(data:IRegister)=>{
        try{
            console.log("THis is data on service", data)
            const apiResponse = await authApiRepository.register(data)
            if (apiResponse?.status!=201){
                return
            }
            console.log("THis is data on service after", data)
            return apiResponse.data
        }catch(e){
            console.error("Failed to get student service: ",e)
            throw e
        }
    },
    login : async(data:ILogin)=>{
        try{
            
            const apiResponse = await authApiRepository.login(data)
            console.log(apiResponse)
            return apiResponse.data
        }catch(e){
            console.error("Failed to post blog service: ",e)
            throw e
        }
    }
}