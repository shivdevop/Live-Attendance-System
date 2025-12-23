import express from "express"
import {createClass,addStudentToClass} from "../controllers/class.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {classSchema,studentIdSchema} from "../validators/class.schema.js"
import {authenticate} from "../middlewares/auth.middleware.js"
import {requireTeacher} from "../middlewares/role.middleware.js"


const router=express.Router()

router.post("/create",authenticate,requireTeacher,validateInput(classSchema),createClass)
router.post("/:classId/add-student",authenticate,requireTeacher,validateInput(studentIdSchema),addStudentToClass)


export default router