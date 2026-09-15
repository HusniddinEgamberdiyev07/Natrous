const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");
const globalErrorHandler = require("./controller/errorHandler");
const AppError = require("./utils/appError");

const app = express();

if(process.env.NODE_ENV === "DEVELOPMENT") app.use(morgan("dev"))

app.use(express.json());
app.set("query parser", "extended")

app.use("/api/tours/", tourRouter);
app.use("/api/users/", userRouter);

app.use((req, res, next)=>{
    next(new AppError(`Cannot find this ${req.originalUrl} on thi sserver.`, 404));
})

app.use(globalErrorHandler)

module.exports = app