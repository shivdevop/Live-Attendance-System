import {Server} from "socket.io"
import jwt from "jsonwebtoken"
import {ENV} from "../config/env.js"
import {success,error} from "../utils/response.js"


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
        console.log("socket connected",socket.user)
    })

    //future websocket events will be added here

    //socket disconnection event
    io.on("disconnect",(socket)=>{
        console.log("socket disconnected",socket.user)
    })

    return io
    }


