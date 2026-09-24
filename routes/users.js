const express = require("express");
const {getAllUsers, createUser, getUser, updateUser, deleteUser} = require("../controller/users");
const {signUp} = require("../controller/auth")

const userRouter = express.Router();

userRouter.post("/sign-up", signUp)

userRouter
    .route("/")
    .get(getAllUsers)
    .post(createUser)
    
userRouter
    .route("/:id")
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)

module.exports = userRouter;