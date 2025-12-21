import {error} from "../utils/response.js"

export const requireTeacher=async(req,res,next)=>{
    const role=req.user.role
    if (role!== "teacher"){
        return error(res,"Forbidden, teacher access required to perform this action")
    }

    next()

}

export const requireStudent=async(req,res,next)=>{
     
    const role=req.user.role
     if(role!=="student"){
        return error(res,"Forbidden, student access required to perform this action")
     }

     next()

}

