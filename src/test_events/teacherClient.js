import { io } from "socket.io-client"

const SERVER_URL = "http://localhost:3000"

const TEACHER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTRhN2ExYTk5YTcxN2FkODU5N2IzYWEiLCJyb2xlIjoidGVhY2hlciIsImlhdCI6MTc2NjkyNjgxNSwiZXhwIjoxNzY3NTMxNjE1fQ.7vwg9qi5instMMLg5_GubXKLK3drIo20XRh5mzP_exw"

const teacherSocket=io(SERVER_URL,{
    auth:{
        token:TEACHER_TOKEN
    }})

teacherSocket.on("connect",()=>{
    console.log("teacher connected to server")
    
    teacherSocket.emit("ATTENDANCE_MARKED",{
        studentId:"6946af243b38eae832537e14",
        status:"present"
    })

    teacherSocket.emit("TODAY_SUMMARY",()=>{
        console.log("today's attendance summary")
    })

    teacherSocket.emit("END_ATTENDANCE",()=>{
        console.log("attendance ended")
    })
})


teacherSocket.on("ATTENDANCE_MARKED",(payload)=>{
    console.log("attendance marked",payload)
})

teacherSocket.on("TODAY_SUMMARY",(payload)=>{
    console.log("today's attendance summary",payload)
})

teacherSocket.on("END_ATTENDANCE",(payload)=>{
    console.log("attendance ended",payload)
})

teacherSocket.on("ERROR",(error)=>{
    console.error("error",error)
})

// teacherSocket.on("disconnect",()=>{
//     console.log("teacher disconnected from server")
// })

// teacherSocket.on("END_ATTENDANCE",(payload)=>{
//     console.log("attendance ended",payload)
// })
