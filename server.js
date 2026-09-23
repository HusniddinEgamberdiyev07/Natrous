process.on("uncaughtException", err =>{
    console.log(err.name, err.message);
    console.log("Uncaught exception, SHUTTING DOWN THE SERVER...");
    process.exit(1);
})

const dotenv = require("dotenv")
dotenv.config({path:"./config.env"});

const mongoose = require("mongoose");

const app = require("./app")

const port = 3000;

mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log("Db has connected")
    })
    .catch(err=>{
        console.log("Cannot connect to database: ", err)
    })
    
const server = app.listen(process.env.PORT || port, ()=>{
    console.log("Server is running...")
})

process.on("unhandledRejection", err =>{
    console.log(err.name, err.message);
    console.log("Unhandled rejection, SHUTTING DOWN THE SERVER...");
    server.close(()=>{
        process.exit(1);
    })
})