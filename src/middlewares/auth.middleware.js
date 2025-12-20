import {ENV} from "../config/env.js"
import jwt from "jsonwebtoken"
import {error} from "../utils/response.js"

export const authenticate=async(req,res,next)=>{
    try {
        const token=req.headers.authorization
        if(!token){
            return error(res,"token missing")
        }

        //verify token
        const decoded=jwt.verify(token,ENV.JWT_SECRET)
        if(!decoded){
            return error(res,"invalid token")
        }

        req.user=decoded //payload will be stored in req.user 

        next()
    } catch (err) {
        return error(res,err.message)
    }
}