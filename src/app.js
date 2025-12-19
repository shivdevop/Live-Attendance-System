import express from "express"
import {success,error} from "./utils/response.js"
const app=express()

//global middleware 
app.use(express.json())

app.get("/health",(req,res)=>{

    return success(res,{status:"ok"})

})

export default app 

