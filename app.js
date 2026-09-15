const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");

const app = express();

if(process.env.NODE_ENV === "DEVELOPMENT") app.use(morgan("dev"))

app.use(express.json());
app.set("query parser", "extended")

app.use("/api/tours/", tourRouter);
app.use("/api/users/", userRouter);

// app.all("/{*anything}", (req, res)=>{
//     res.status(404).json({
//         status:"fail",
//         message:`Cannot find this ${req.originalUrl} on thi sserver.`
//     })
// })

app.use((req, res, next)=>{
    const err = new Error(`Cannot find this ${req.originalUrl} on thi sserver.`);
    err.statusCode = 404;
    err.status = "fail"
    next(err);
})

app.use((err, req, res, next)=>{
    err.statusCode = err.statusCode || 500
    err.status = err.status || "error"
    
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
})

module.exports = app