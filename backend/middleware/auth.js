const User = require('../models/User')
const catchAsyncErrors = require('./catchAsyncErrors')
const jwt = require('jsonwebtoken')
const Seller = require('../models/Shop')
const LWPError = require('../utils/error')

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.cookies

    if(!token ) {
        return next( new LWPError("Please login to continue", 401))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)


    next()
})

exports.isSeller = catchAsyncErrors(async(req, res, next) => {
    const {seller_token} = req.cookies 
    if(!seller_token){
        return next(new LWPError("Please login to continue", 401))
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET)
    req.seller = await Seller.findById(decoded.id)

    next()

})