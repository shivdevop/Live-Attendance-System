import {error} from "../utils/response.js"

export const requireTeacher=async(req,res,next)=>{
    const role=req.user.role
    if (role!== "teacher"){
        return error(res,"Forbidden, teacher access required")
    }

    next()

}

export const requireStudent=async(req,res,next)=>{
     const role=req.user.role
     if(role!=="student"){
        return error(res,"forbidden, student access required")
     }

     next()

}