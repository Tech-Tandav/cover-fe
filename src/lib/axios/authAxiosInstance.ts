import axios from "axios";

export const authInstance = axios.create({
    baseURL:process.env.NEXT_PUBLIC_BASEURL
})