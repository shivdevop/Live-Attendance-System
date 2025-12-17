import app from "./app.js"
import {connectDB} from "./config/db.js"
import { ENV } from "./config/env.js"


const startServer=async()=>{
    try {
        await connectDB()
        app.listen(ENV.PORT,()=>{
            console.log(`server is running on port ${ENV.PORT}`)
        })

    } catch (error) {
        console.log("error starting server",error)
        process.exit(1)
    }
}

startServer()