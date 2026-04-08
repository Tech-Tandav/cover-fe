export interface ILogin{
    username:string;
    password:string;
}

export interface IRegister extends ILogin{
    email:string;
    confirmPassword:string;
    phone:string
}