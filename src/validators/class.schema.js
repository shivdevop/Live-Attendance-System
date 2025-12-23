import {z} from "zod"

export const classSchema=z.object({
    className:z.string().min(2,"class name is required")
})

