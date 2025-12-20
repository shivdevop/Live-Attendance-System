import {error} from "../utils/response.js"

//input body validation middleware
export const validateInput=(schema)=>{
    return (req,res,next)=>{
        try {
            schema.parse(req.body)
            next()
        } catch (err) {
            return error(res,"invalid input data against schema")
        }
    }
}