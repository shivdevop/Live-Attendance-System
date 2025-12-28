import {Server} from "socket.io"
import jwt from "jsonwebtoken"
import {ENV} from "../config/env.js"
import {success,error} from "../utils/response.js"
import {activeSession,clearSession} from "./session.js"
import Attendance from "../models/Attendance.js"
import Class from "../models/Class.js"

export const initSocket=(httpServer)=>{
    //create a new socket server 
    const io=new Server(httpServer,{
        cors:{
            origin:"*"
        }
    })

    //socket auth middleware 
    io.use((socket,next)=>{
        try {
            const token=socket.handshake.auth?.token

            if(!token){
                return next(new Error("authentication required"))
            }

            const decoded=jwt.verify(token,ENV.JWT_SECRET)

            //attach user info to socket
            socket.user={
                userId:decoded.userId,
                role:decoded.role
            }

            next()
        } catch (err){
            return next(new Error("unauthorized"))

        }
    })

    //socket connection event
    io.on("connection",(socket)=>{
         socket.on("ATTENDANCE_MARKED",(payload)=>{
            if (socket.user.role!=="teacher"){
                return socket.emit("ERROR",{
                    message:"only teachers can mark attendance"
                })
            }

             // Fix: Check if session exists AND has attendance property
             if(!activeSession || !activeSession.attendance || !activeSession.classId){
                return socket.emit("ERROR",{
                    message:"attendance not yet started"
                })
             }

            const {studentId,status}=payload || {}

            if (!studentId || !["present","absent"].includes(status)){
                return socket.emit("ERROR",{
                    message:"invalid attendance data"
                })
            }

            //update in memory attendance
            activeSession.attendance[studentId]=status

            //broadcast update to everyone 
            io.emit("ATTENDANCE_MARKED",{
                studentId,
                status
            })

         })

         socket.on("MY_ATTENDANCE",()=>{
            if(socket.user.role!=="student"){
                return socket.emit("ERROR",{
                    message:"only students can view their attendance"
                })
            }

            if(!activeSession || !activeSession.attendance || !activeSession.classId){ 
                return socket.emit("ERROR",{
                    message:"attendance not yet started"
                })
            }

            const studentId=socket.user.userId
            const attendance=activeSession.attendance[studentId] || "not marked"

            return socket.emit("MY_ATTENDANCE",{
                studentId,
                attendance
            })
         })

         socket.on("TODAY_SUMMARY",()=>{
            if(socket.user.role!=="teacher"){
                return socket.emit("ERROR",{
                    message:"only teachers can view today's summary"
                })
            }

            if(!activeSession || !activeSession.attendance || !activeSession.classId){
                return socket.emit("ERROR",{
                    message:"attendance not yet started"
                })
            }

            const today= new Date().toISOString().split("T")[0]
            const attendanceSummary=Object.values(activeSession.attendance)

            const present=attendanceSummary.filter(status=>status==="present").length
            const absent=attendanceSummary.filter(status=>status==="absent").length
            const total=present+absent

            const summary={
                date:today,
                totalStudents:total,
                present,
                absent,
            }

            //broadcast summary to everyone
            io.emit("TODAY_SUMMARY",summary)

         })

         socket.on("END_ATTENDANCE",async()=>{

            //teacher only can end attendance
            if(socket.user.role!=="teacher"){
                return socket.emit("ERROR",{
                    message:"only teachers can end attendance"
                })
            }

            //active session should exist
            if(!activeSession || !activeSession.attendance || !activeSession.classId){
                return socket.emit("ERROR",{
                    message:"attendance not yet started"
                })
            }

            try {
                const {classId,attendance}=activeSession || {}
    
                //fetch class details
                const classDetails=await Class.findById(classId)
                if(!classDetails){
                    return socket.emit("ERROR",{
                        message:"class not found"
                    })
                }
    
                //get all student ids
                const studentIds=classDetails.studentIds.map(studentId=>studentId.toString())
                
                //finalize attendance
                let present=0
                let absent=0
    
    
                const records=studentIds.map(studentId=>{
                    const status=attendance[studentId] || "absent"
    
                    if(status==="present"){
                        present++
                    }else{
                        absent++
                    }
    
                    return {
                        classId,
                        studentId,
                        status
                    }
                })
    
                //save records to database
                await Attendance.insertMany(records)
                clearSession()
    
                //broadcast final result
                io.emit("END_ATTENDANCE",{
                  message:"attendance ended successfully",
                  studentsPresent:present,
                  studentsAbsent:absent
                })
            } catch (err) {
                console.error("error ending attendance",err)
                return socket.emit("ERROR",{
                    message:err.message
                })
            }


         })

        //socket disconnection event
        socket.on("disconnect",()=>{
            console.log("socket disconnected",socket.user.userId)
        })

        })

    return io
    }


