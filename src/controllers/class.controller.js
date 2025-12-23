import {success,error} from "../utils/response.js"
import Class from "../models/Class.js"
import User from "../models/User.js"

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

export const addStudentToClass=async(req,res)=>{
    try {
        const classId=req.params.classId
    
        const existingclass= await Class.findById(classId)
        if(!existingclass){
            return error(res,"class not found")
        }
    
        const teacherId=req.user.userId
        if(existingclass.teacherId.toString()!==teacherId){
            return error(res,"you are not authorized to add student to this class")
        }

        const {studentId}=req.body
    
        const student=await User.findById(studentId)
     
        if(!student || student.role!=="student"){
            return error(res,"student not found")
        }
    
        if(existingclass.studentIds.includes(studentId)){
            return error(res,"student is already enrolled in this class")
        }
    
        //if student is not enrolled in the class, add them to the class
        existingclass.studentIds.push(studentId)
        await existingclass.save()
    
        return success(res,existingclass)
    } catch (err) {
        return error(res,err.message)
        
    }

}