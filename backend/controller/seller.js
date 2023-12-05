const express = require('express')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../utils/mailer')
const ShopModel = require('../models/Shop')
const LWPError = require('../utils/error')
const sendToken = require('../utils/jwtToken')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

//TODO 8 endpoints for seller-controller (/localhost:8080/api/v1/seller)
const sellerRouter = express.Router()

sellerRouter.get('/', (req,res) => {
    res.send('sellerRouter')
})

////create-seller
sellerRouter.post('/create', async (req, res, next) =>{
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

    const allUsers = await ShopModel.find({email})

    const isEmailExists = allUsers.length >0
    if(isEmailExists){
        return next(
            new LWPError('Seller with the provided email already exists', 401)
        )
    }



    const activationToken = createActivationToken({name, email, password})

    const activationUrl = `http://localhost:8080/api/v1/seller/activation/?token=${activationToken}`

    //email should be sent to the requesting email
    await sendMail({
        email: email,
        subject: 'Please Activate your Account',
        message: `To activate your Account click the link ${activationUrl}`
    })

    res.status(200).json({success: true, message: 'Seller Activation link sent'})
})

////activate-seller
sellerRouter.get('/activation', catchAsyncErrors(async (req, res, next) => {
    try{
        const {token} = req.query
        console.log("Token :: ", token)

        //get the name, email and password from the sellerData (that was used to create token) returned by verify() function
        const {name, email, password} = jwt.verify(token, process.env.JWT_SECRET)

        const allUsers = await ShopModel.find({email})

        const isEmailExists = allUsers.length >0
        if(isEmailExists){
            return next(
                new LWPError('Seller with the provided email already exists', 401)
            )
        }


        //if seller is verified, store the new seller into db using model
        const sellerCreated = await ShopModel.create({name, email, password})
        console.log('Seller Created :: ', sellerCreated)

        //res.status(200).send('Seller Activated')
        sendToken(sellerCreated, 201, res, "seller_token")//call sendToken module in jwtToken
    }
    catch(err){
        return next(new LWPError(err, 500))
    }
}))

//create Activation token
const createActivationToken = (sellerData) =>{
    return jwt.sign(sellerData, process.env.JWT_SECRET, {expiresIn :"22h"})
}

////login-seller
sellerRouter.post('/login', catchAsyncErrors(async(req, res, next) => {
    try{
        const {email, password} = req.body
        //validate email and password
        if(!email || !password){
            return next(new LWPError('EMail and password are required', 400))
        }

        const seller = await ShopModel.findOne({email}).select("+password")

        if(!seller){
            return next(new LWPError('Seller with the provided email not found', 404))
        }

        const isPasswordMatched = await seller.comparePassword(password)

        if(!isPasswordMatched){
            return next(new LWPError("Provided password doesn't match", 401))
        }

        sendToken(seller, 200, res, "seller_token")
    }
    catch(err){
        return next(new LWPError(err, 500))
    }
}))

module.exports = sellerRouter