const AppError = require("../utils/appError")

const handleCastErrorDb = err => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

const handleDuplicateDb = err => {
    const message = `Duplicate value: "${Object.values(err.cause.keyValue)[0]}", use another value`
    return new AppError(message, 400)
}

const handleValidationDb = err => {
    const errors = Object.values(err.errors).map(el=>el.message)
    return new AppError(`Invalid input data. ${errors.join(". ")}`, 400)
}

const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        err:err,
        stack:err.stack
    })
}

const sendErrorProd = (err, res)=>{
    if(err.isOperational){
        // Operation trusted error, send msg to client
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        })
    }else{
        // Unexpected errors or programming errors, do not leak error details
        console.error("Error 🪲", err);

        res.status(500).json({
            status:"error",
            message:"Server error"
        })
    }
}

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    
    if(process.env.NODE_ENV === "DEVELOPMENT"){
        sendErrorDev(err, res)
    }else if(process.env.NODE_ENV === "PRODUCTION"){
        let error = {...err};
        
        error.name = err.name;
        error.message = err.message;
        error.cause = err.cause;

        if(error.name === "CastError") error = handleCastErrorDb(error)
        if(error.name === "ValidationError") error = handleValidationDb(error)
        if(error.cause?.code === 11000) error = handleDuplicateDb(error)

        sendErrorProd(error, res)
    }
}