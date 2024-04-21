import bcrypt, { compare }  from 'bcryptjs';
import configKeys from "../../config";


export const authService=()=>{
    const encryptedPassword=async(password:string)=>{
        console.log(password,"in hashing");  
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password,salt)
        return password
    };

    const comparePassword=async(inputPassword:string,password:string)=>{
        return await bcrypt.compare(inputPassword,password);
    }

    const generateOtp=()=>{
        const otp=Math.floor(100000+Math.random()*900000);
        return `${otp}`
    }



    return{
        encryptedPassword,
        comparePassword,
        generateOtp
    }
}
export type AuthService= typeof authService;
export type AuthServiceReturn=ReturnType<AuthService>;