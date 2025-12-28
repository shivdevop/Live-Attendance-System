import mongoose from "mongoose"

const attendanceSchema=new mongoose.Schema({
    classId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class",
        required:true
    },
    studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    status:{
        type:String,
        enum:["present","absent"],
        required:true
    }
},{
    timestamps:true
})

const Attendance=mongoose.model("Attendance",attendanceSchema)

export default Attendance