const express = require('express')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../utils/mailer')
const UserModel = require('../models/User')
const LWPError = require('../utils/error')
const sendToken = require('../utils/jwtToken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

//TODO 7 endpoints for user-controller (/localhost:8080/api/v1/user)
const userRouter = express.Router()

userRouter.get('/', (req,res) => {
    res.send('userRouter')
})

////create-user
userRouter.post('/create', async (req, res, next) =>{
    const {name, email, password} = req.body

    if (!name) {
        return next(new LWPError('Name cannot be empty', 401))
    }

    if (!password) {
        return next(new LWPError('password cannot be empty', 401))
    }

    //Email validation
    //Check if the email is in a valid format
    // Regex

    const allUsers = await UserModel.find({email})

    const isEmailExists = allUsers.length >0
    if(isEmailExists){
        return next(
            new LWPError('User with the provided email already exists', 401)
        )
    }



    const activationToken = createActivationToken({name, email, password})

    const activationUrl = `http://localhost:8080/api/v1/user/activation/?token=${activationToken}`

    //email should be sent to the requesting email
    await sendMail({
        email: email,
        subject: 'Please Activate your Account',
        message: `To activate your Account click the link ${activationUrl}`
    })

    res.status(200).json({success: true, message: 'User Activation link sent'})
})

////activate-user
userRouter.get('/activation', catchAsyncErrors(async (req, res, next) => {
    try{
        const {token} = req.query
        console.log("Token :: ", token)

        //get the name, email and password from the userdata (that was used to create token) returned by verify() function
        const {name, email, password} = jwt.verify(token, process.env.JWT_SECRET)

        const allUsers = await UserModel.find({email})

        const isEmailExists = allUsers.length >0
        if(isEmailExists){
            return next(
                new LWPError('User with the provided email already exists', 401)
            )
        }


        //if user is verified, store the new user into db using model
        const userCreated = await UserModel.create({name, email, password})
        console.log('User Created :: ', userCreated)

        //res.status(200).send('User Activated')
        sendToken(userCreated, 201, res, "user_token")//call sendToken module in jwtToken which returns http response with success msg, user and token 
    }
    catch(err){
        return next(new LWPError(err, 500))
    }
}))

//create Activation token
const createActivationToken = (userData) =>{
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn :"22h"})
}

////login-user
userRouter.post('/login', catchAsyncErrors(async(req, res, next) => {
    try{
        const {email, password} = req.body
        //validate email and password
        if(!email || !password){
            return next(new LWPError('Email and password are required', 400))
        }

        const user = await UserModel.findOne({email}).select("+password")

        if(!user){
            return next(new LWPError('User with the provided email not found', 404))
        }

        const isPasswordMatched = await user.comparePassword(password)

        if(!isPasswordMatched){
            return next(new LWPError("Provided password doesn't match", 401))
        }

        sendToken(user, 200, res, "user_token")
    }
    catch(err){
        return next(new LWPError(err, 500))
    }
}))

module.exports = userRouter