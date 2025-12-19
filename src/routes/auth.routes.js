import express from "express"
import {signup} from "../controllers/auth.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {signupSchema} from "../validators/auth.schema.js"


const router=express.Router()

//auth routes 
router.post("/signup",validateInput(signupSchema),signup)

export default router 