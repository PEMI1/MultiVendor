const sendToken = (user, statusCode, res, tokenName = "token") => {
    const token = user.getJwtToken()//calls custom method defined in User model 

    //options for cookies
    const options = {
        expires : new Date(Date.now() + 90*24*60*60*1000),
        httpOnly: true,
        sameSite: "none",
        secure: true
    }
    res.status(statusCode).cookie(tokenName, token, options).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken//when this module is called it returns res