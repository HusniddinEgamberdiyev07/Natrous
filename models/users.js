const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please tell us your name"]
    },
    email:{
        type:String,
        unique:[true, "There is a user with this email"],
        required:[true, "Please tell us your email"],
        lowercase:true,
        validate:[validator.isEmail,"Please provide a valid email"]
    },
    photo:String,
    password:{
        type:String,
        required:[true, "Please tell us your password"],
        minlength:[8, "Password must contain 8 or more chars"],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true, "Please confirm your password"],
        validate:{
            // It wokrs only on save or create
            validator:function(val){
                return this.password === val
            },
            message:"Password and confirm password must be the same"
        }
    }
})

usersSchema.pre("save", async function(){
    // this.isModified("password") -> checks is field modified
    if(!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password,13);
    this.passwordConfirm = undefined; // we don't want to save it to the database;
})

// instance method. It will be accessible for every doc. this keyword points to the current doc

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}


module.exports = mongoose.model("User", usersSchema);