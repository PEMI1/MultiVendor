const express = require('express')

const userRouter = express.Router()

userRouter.post('/create', (req, res) =>{[
    res.send("Create")
]})

module.exports = userRouter