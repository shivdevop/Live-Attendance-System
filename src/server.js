import app from "./app.js"
import {connectDB} from "./config/db.js"
import { ENV } from "./config/env.js"
import {initSocket} from "./socket/index.js"
import http from "http"


const startServer=async()=>{
    try {
        await connectDB()

        //create http server from express app 
        const httpServer=http.createServer(app)
        
        //initialize socket.io server
        initSocket(httpServer)
        
        //start http server
        httpServer.listen(ENV.PORT,()=>{
            console.log(`server is running on port ${ENV.PORT}`)
            console.log("socket server is running")
        })

    } catch (error) {
        console.log("error starting server",error)
        process.exit(1)
    }
}

startServer()