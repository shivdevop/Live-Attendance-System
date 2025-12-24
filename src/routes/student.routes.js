import User from "../models/User.js"
import {authenticate} from "../middlewares/auth.middleware.js"
import {requireTeacher} from "../middlewares/role.middleware.js"
import {getAllStudents} from "../controllers/student.controller.js"
import express from "express"

const router=express.Router()

//only teachers can get list of all the students 


router.get("/all",authenticate,requireTeacher,getAllStudents)

export default router

