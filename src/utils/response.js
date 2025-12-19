
export const success=(res,data,statusCode=200)=>{
    return res.status(statusCode).json({
        success:true,
        data
    })
}

export const error=(res,errorMsg,statusCode=400)=>{
    return res.status(statusCode).json({
        success:false,
        error:errorMsg || "Internal server error"
    })

}