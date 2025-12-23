import express from "express"
import {createClass} from "../controllers/class.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {classSchema} from "../validators/class.schema.js"
import {authenticate} from "../middlewares/auth.middleware.js"
import {requireTeacher} from "../middlewares/role.middleware.js"

const router=express.Router()

router.post("/create",authenticate,requireTeacher,validateInput(classSchema),createClass)

export default router