const express = require('express')

const appRouter = express.Router()
const userRouter = require('./user-controller')

appRouter.use('/user', userRouter)

module.exports = userRouter