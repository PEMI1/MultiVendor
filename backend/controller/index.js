const express = require('express')

//TODO 5 endpoints for index
const appRouter = express.Router()

appRouter.get('/', (req,res) =>{
    res.send('appRouter from index')
})

//TODO 6 route to other controllers
const userRouter = require('./user')
const sellerRouter = require('./seller')
const productRouter = require('./product')
const orderRouter = require('./order')
appRouter.use('/user', userRouter) // /localhost:8080/api/v1/
appRouter.use('/seller', sellerRouter)
appRouter.use('/product', productRouter)
appRouter.use('/order', orderRouter)

module.exports = appRouter