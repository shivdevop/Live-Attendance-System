import express from "express"
import {signup,login,getRole} from "../controllers/auth.controller.js"
import {validateInput} from "../middlewares/validate.middleware.js"
import {signupSchema,loginSchema} from "../validators/auth.schema.js"
import {authenticate} from "../middlewares/auth.middleware.js"

const router=express.Router()

//auth routes 
router.post("/signup",validateInput(signupSchema),signup)
router.post("/login",validateInput(loginSchema),login)

router.get("/get-role",authenticate,getRole)



export default router 