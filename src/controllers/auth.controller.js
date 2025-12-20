import {success,error} from "../utils/response.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import {generateToken} from "../utils/jwt.js"

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

        const newUser=await User.create({name,email,role,password:hashedPassword})
        if(!newUser){
            return error(res,"failed to create user")
        }

        return success(res,newUser)

    } catch (err) {
        return error(res,err.message)
    }
}

export const login=async(req,res)=>{
    const {email,password}=req.body
    console.log(email,password)

    const ifUserExists=await User.findOne({email})

    if(!ifUserExists){
        return error(res,"user not found")
    }

    const isPasswordCorrect=await bcrypt.compare(password,ifUserExists.password)
    if(!isPasswordCorrect){
        return error(res,"incorrect password")
    }

    //now if password is also valid, login and generate token and return it 
    const token=generateToken({userId:ifUserExists._id, role:ifUserExists.role})

    if (!token){
        return error(res,"failed to generate token")
    }

    return success(res,{token:token})

}

