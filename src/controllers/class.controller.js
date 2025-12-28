import {success,error} from "../utils/response.js"
import Class from "../models/Class.js"
import User from "../models/User.js"
import {startSession,clearSession} from "../socket/session.js"



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

export const getClassDetails=async(req,res)=>{
    try {
        const classId=req.params.classId
        console.log(classId)
        
        const {userId,role}=req.user

        //find class 
        const targetClass=await Class.findById(classId).populate("studentIds","name email")
        if (!targetClass){
            return error(res,"class not found")
        } 
        console.log("our target class is:",targetClass)

        const ifTeacherOwner= role==="teacher" && userId===targetClass.teacherId.toString()
        console.log("if teacher owner:",ifTeacherOwner)
        const ifStudentEnrolled= role==="student" && targetClass.studentIds.some(s=>s._id.toString()===userId)
        console.log("if student enrolled:",ifStudentEnrolled)

        if(!ifTeacherOwner && !ifStudentEnrolled){
            return error(res,"you are not authorized to access this class")
        }

        const classDetails={
            _id: targetClass._id,
            className: targetClass.className,
            teacherId: targetClass.teacherId,
            students: targetClass.studentIds
        }

        return success(res,classDetails)



        
    } catch (err) {
        return error(res,err.message)
    }
}


export const startAttendance=async(req,res)=>{
    try {
        const {classId}=req.body
        const teacherId=req.user.userId

        //class should exist 
        const targetClass=await Class.findById(classId)
        if(!targetClass){
            return error(res,"class not found")
        }

        //ownership check
        if (targetClass.teacherId.toString()!==teacherId){
            return error (res,"you are not authorized to start attendance for this class")
        }

        //start attendance 
        startSession(classId)
        console.log("attendance started successfully")
        return success(res,"attendance started successfully")

    } catch (err) {
        return error(res,err.message)
    }

}