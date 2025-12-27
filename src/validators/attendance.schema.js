import {z} from "zod"

export const attendanceSchema=z.object({
    classId:z.string().min(1,"classId is required")
})