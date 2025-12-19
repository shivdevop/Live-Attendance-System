
export const success=(res,data,statusCode=200)=>{
    return res.status(statusCode).json({
        success:true,
        data
    })
}

export const error=(res,error,statusCode=400)=>{
    return res.status(statusCode).json({
        success:false,
        error:error.message || "InternaL server error"
    })

}