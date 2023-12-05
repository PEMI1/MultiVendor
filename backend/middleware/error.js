//This custom error handling middleware assumes that the error object (err) passed to it has a statusCode and message property. If these properties are not present, default values are assigned. Additionally, it sends a JSON response with the error details.

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal server error"

    res.status(err.statusCode).json({
        success :false,
        message : err.message
    })
}