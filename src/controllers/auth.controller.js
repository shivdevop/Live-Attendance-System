import {success,error} from "../utils/response.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"

export const signup=async(req,res)=>{
    try {
        //get data from req body 
        const {name,email,password,role}=req.body

        //check if user already exists 
        const existingUser=await User.findOne({email})
        if(existingUser){
        return error(res,"user already exists")
        }

        //hash the password before creating user 
        const hashedPassword=await bcrypt.hash(password,10)

        const newUser=await User.create({name,email,role})
        if(!newUser){
            return error(res,"failed to create user")
        }

        return success(res,newUser)

    } catch (err) {
        return error(res,err.message)
    }
}