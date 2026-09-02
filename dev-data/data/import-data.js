const dotenv = require("dotenv")
dotenv.config({path:"./config.env"});

const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("../../models/tours")

mongoose.connect(process.env.DATABASE)
    .then(()=>{
        console.log("Db has connected")
    })
    .catch(err=>{
        console.log(err);
    })


const data = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`));

const import_data = async ()=>{
    try{
        await Tour.create(data)
        console.log("Docs created");
        process.exit()
    }catch(err){
        console.log(err);
    }
}

const delete_data = async ()=>{
    try{
        await Tour.deleteMany()
        console.log("Docs deleted");
        process.exit()
    }catch(err){
        console.log(err)
    }
}

if(process.argv[2] === "--d") delete_data()
if(process.argv[2] === "--i") import_data()