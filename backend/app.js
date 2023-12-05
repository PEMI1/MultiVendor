const express = require('express')
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')

//TODO 3 endpoints for app
const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send("Home")
})

app.get('/test', (req, res) => {
    res.send("Working")
})


//TODO 4 route to controllers' index
const appRouter = require('./controller')//even without ./controller/index the process goes to index file in controller folder
app.use('/api/v1', appRouter)//for all controllers path is = /localhost:8080/api/v1


app.use(errorMiddleware) //Make sure to attach it after all other route and middleware definitions to catch and handle errors globally in the application

module.exports = app