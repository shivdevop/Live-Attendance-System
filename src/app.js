// import User from "./models/User.js"
import express from "express"
import {success,error} from "./utils/response.js"

const app=express()

//global middleware 
app.use(express.json())

// app.post("/api/users/register",async(req,res)=>{
//     try {
//         const {name,email,password,role}=req.body
//         console.log(name,email,password,role)

//         const newuser=await User.create({name,email,password,role})
//         if (!newuser){
//             return error(res,"failed to create user")
//         }

//         return success(res,newuser)
        
//     } catch (err) {
//         return error(res,err.message)
        
//     }
// })




app.get("/health",(req,res)=>{

    return success(res,{status:"ok"})

})

export default app 

