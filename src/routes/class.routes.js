import express from "express"
import {createClass,addStudentToClass,getClassDetails,startAttendance} from "../controllers/class.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {classSchema,studentIdSchema} from "../validators/class.schema.js"
import {authenticate} from "../middlewares/auth.middleware.js"
import {requireTeacher} from "../middlewares/role.middleware.js"
import {attendanceSchema} from "../validators/attendance.schema.js"


const router=express.Router()

router.post("/create",authenticate,requireTeacher,validateInput(classSchema),createClass)
router.post("/:classId/add-student",authenticate,requireTeacher,validateInput(studentIdSchema),addStudentToClass)

//get a class details
router.get("/:classId",authenticate,getClassDetails)

//start attendance for a class (only teachers can start attendance)
router.post("/start-attendance",authenticate,requireTeacher,validateInput(attendanceSchema),startAttendance)


export default router