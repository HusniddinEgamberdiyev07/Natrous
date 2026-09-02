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
        console.log(err);
    })
    
app.listen(process.env.PORT || port, ()=>{
    console.log("Server is running...")
})