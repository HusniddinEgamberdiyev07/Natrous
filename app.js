const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");

const app = express();

if(process.env.NODE_ENV === "DEVELOPMENT") app.use(morgan("dev"))

app.use(express.json());

app.use((req, res, next)=>{
    console.log("Hello from a middleware 👋");
    next()
})

app.use("/api/tours/", tourRouter);
app.use("/api/users/", userRouter)

app.use((err, req, res, next)=>{
    res.status(500).json({
        status:"fail",
        message:err.message
    })
})

module.exports = app