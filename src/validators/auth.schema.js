import {z} from "zod"

export const signupSchema=z.object({
    name:z.string().min(2,"name is required"),
    email:z.string().email("invalid email format"),
    password:z.string().min(6).max(20,"password must be bw 6 and 20 chars"),
    role:z.enum(["teacher","student"],"role is required")

})

export const loginSchema=z.object({
    email: z.string().email(),
    password:z.string().min(6).max(20)
})

