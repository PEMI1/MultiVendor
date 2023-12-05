const loadEnv = require('dotenv')

const app = require('./app')
const db = require('./db/db')

loadEnv.config({
    path :"config/.env"
})

//run server.js 
//TODO 1 connect to db
db.connectDatabase()

//TODO 2 setup express app on server 
const server = app.listen(process.env.PORT, () =>{ 
    console.log(`Server running on port ${process.env.PORT}`)
})


//If any un-handled exceptions then we will shut down the server
process.on("unhandledRejection", (err) => {
    console.log(`Shutting down the server for ${err.message}`)
    console.log(`Shutting down the server for unhandled promise rejection`)

    server.close(() =>{
        process.exit(1)
    })
})

