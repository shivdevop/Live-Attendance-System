import {z} from "zod"

export const classSchema=z.object({
    className:z.string().min(2,"class name is required")
})

export const studentIdSchema=z.object({
    studentId:z.string().min(1,"student id is required")
})