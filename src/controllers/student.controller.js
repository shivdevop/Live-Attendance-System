import User from "../models/User.js"
import {success,error} from "../utils/response.js"

export const getAllStudents=async(req,res)=>{

    try {
        const students=await User.find({
            role:"student" //filter condition
        },{
            name:1,
            email:1   //projected fields
        })

        if(!students){
            return error(res,"no students found")
        }

        return success(res,students)
        
    } catch (err) {
        return error(res,err.message)
    }


}