import {success,error} from "../utils/response.js"
import Class from "../models/Class.js"


export const createClass=async(req,res)=>{
    try {
        const {className}=req.body
        const teacherId=req.user.userId

        const newClass=await Class.create({
            className,
            teacherId,
            studentIds:[]
        })

        if(!newClass){
            return error(res,"failed to create class")
        }

        return success(res,newClass)

    } catch (err) {
        return error(res,err.message)
    }
}