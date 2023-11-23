const express = require('express')

const app = express()

const appRouter = require('./controller')

app.get('/', (req, res) => {
    res.send("Home")
})

app.get('/test', (req, res) => {
    res.send("Working")
})


module.exports = app