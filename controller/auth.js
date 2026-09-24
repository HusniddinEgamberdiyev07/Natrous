const Users = require("../models/users");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res)=>{
    const newUser = await Users.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm
    });

    const token = jwt.sign({id:newUser._id}, process.env.SECRET_JWT_KEY, {expiresIn:process.env.JWT_EXPIRES_IN})

    res.status(201).json({
        status:"success",
        token,
        data:newUser
    })
}