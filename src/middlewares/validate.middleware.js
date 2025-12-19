import {error} from "../utils/response.js"

export const validateInput=(schema)=>{
    return (req,res,next)=>{
        try {
            schema.parse(req.body)
            next()
        } catch (err) {
            return error(res,"invalid input data")
        }
    }
}