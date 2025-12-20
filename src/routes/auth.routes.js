import express from "express"
import {signup,login} from "../controllers/auth.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {signupSchema,loginSchema} from "../validators/auth.schema.js"


const router=express.Router()

//auth routes 
router.post("/signup",validateInput(signupSchema),signup)
router.post("/login",validateInput(loginSchema),login)


export default router 