import express from "express"

const app=express()

//global middleware 
app.use(express.json())

app.get("/health",(req,res)=>{
    res.json({
        success:true,
        data:{status:"ok"}
    })

})

export default app 

