const {promisify} = require("util");
const Users = require("../models/users");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

const signToken = id => jwt.sign({id}, process.env.SECRET_JWT_KEY, {expiresIn:process.env.JWT_EXPIRES_IN});

exports.signUp = async (req, res, next)=>{

    if(req.body.role === "admin") return next(new AppError("You cannot assign admin role", 403));

    const newUser = await Users.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
        passwordChangedAt:req.body.passwordChangedAt,
        role:req.body.role || "user"
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
    
    if(!user || !(await user.correctPassword(password, user.password)) ){
        return next(new AppError("Password or email is incorrect", 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
        status:"success",
        token
    })
}

exports.protect = async (req, res, next) =>{
    // getting token and check is it there
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) return next(new AppError("You are not logged in, please login", 401));

    // verify token
    const decode = await promisify(jwt.verify)(token, process.env.SECRET_JWT_KEY);
    
    // check if user still exists
    const currentUser = await Users.findById(decode.id);

    if(!currentUser) return next(new AppError("The user who has this token does not exits", 401));

    // check if password is modified
    const isPasswordChanged = currentUser.changedPasswordAfter(decode.iat);

    if(isPasswordChanged) return next(new AppError("User has recently changed a password, please login again", 401))

    // Grant access to protected route
    req.user = currentUser;
    next();
}


exports.restrictedTo=(...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)) return next(new AppError(`You do not have a permission to do this action`, 403));
        next()
    }
}