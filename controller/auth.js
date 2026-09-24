const Users = require("../models/users");

exports.signUp = async (req, res)=>{
    const newUser = await Users.create(req.body);

    res.status(201).json({
        status:"success",
        data:newUser
    })
}