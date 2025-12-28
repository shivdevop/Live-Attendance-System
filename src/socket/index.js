import {Server} from "socket.io"
import jwt from "jsonwebtoken"
import {ENV} from "../config/env.js"
import {success,error} from "../utils/response.js"
import {activeSession} from "./session.js"


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

            if(!activeSession){
                return scoket.emit("ERROR",{
                    message:"attendance not yet started"
                })
            }

            const {studentId,status}=payload || {}

            if (!studentId || !["present","absent"].includes(status)){
                return socket.emit("ERROR",{
                    message:"invalid attendance data"
                })
            }

            //update in memory attendace
            activeSession.attendance[studentId]=status

            //broadcast update to everyone 
            io.emit("ATTENDANCE_MARKED",{
                studentId,
                status
            })

         })

         socket.on("MY_ATTENDANCE",()=>{
            if socket.user.role!=="student"{
                return socket.emit("ERROR",{
                    message:"only students can view their attendance"
                })
            }

            if(!activeSession){
                return scoket.emit("ERROR",{
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

     })

    //future websocket events will be added here


    //socket disconnection event
    io.on("disconnect",(socket)=>{
        console.log("socket disconnected",socket.user)
    })

    return io
    }


