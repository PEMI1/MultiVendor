const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema =  new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter your name"]
    },
    email:{
        type:String,
        required: [true, 'Please enter your email']
    },
    password:{
        type: String,
        required: [true, 'Please enter your password'],
        minLength:[4, 'Password should be greater than 4 characters'],
        select: false //when you perform a query to find a user (e.g., User.findOne()), the password field will not be included in the result by default
    },
    createdAt: {
        type:Date,
        default: Date.now()
    }
})

//hash password
userSchema.pre('save', async function(next){//pre method runs before model saves the user into db
    if(!this.isModified('password')) { //if password field in the db for current obj/this already exists then skip to next process(ie. save the user)
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

//when you call this function, it will return jwt token created from document's(current this) id
userSchema.methods.getJwtToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES
    })
}

//compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    console.log(enteredPassword, this.password)
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)