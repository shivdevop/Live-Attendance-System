//testing a particular student's attendance

import { io } from "socket.io-client"



const SERVER_URL = "http://localhost:3000"
const STUDENT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTQ2YWYyNDNiMzhlYWU4MzI1MzdlMTQiLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc2NjkyOTgwMCwiZXhwIjoxNzY3NTM0NjAwfQ.ix299PBWAkN9iXEDEbW3fwbpYTfX14EthAjSmeJBaP8"

const studentSocket=io(SERVER_URL,{
    auth:{
        token:STUDENT_TOKEN
    }})

studentSocket.on("connect",()=>{
    console.log("student connected to server")

    studentSocket.emit("MY_ATTENDANCE",()=>{
        console.log("my attendance",payload)
    })
})

studentSocket.on("MY_ATTENDANCE",(payload)=>{
    console.log("my attendance",payload)
})

studentSocket.on("ERROR",(error)=>{
    console.error("error",error)
})