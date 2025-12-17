import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB=async()=>{
    try {
        const MONGO_URL=`${ENV.MONGO_URI}/${ENV.DB_NAME}`
        await mongoose.connect(MONGO_URL)
        console.log("connected to db")
    } catch (error) {
        console.log("error connecting to db",error)
    }
}

