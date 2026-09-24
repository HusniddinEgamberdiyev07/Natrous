const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = id => jwt.sign({id}, process.env.SECRET_JWT_KEY, {expiresIn:process.env.JWT_EXPIRES_IN});

exports.signUp = async (req, res)=>{
    const newUser = await Users.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status:"success",
        token,
        data:newUser
    })
}


exports.login = async (req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password) return next(new AppError("Please provide email and password", 400));
    
    const user = await Users.findOne({email}).select("+password");
    console.log(user);
    
    if(!user || !(await user.correctPassword(password, user.password)) ){
        return next(new AppError("Password or email is incorrect", 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
        status:"success",
        token
    })
}