const allowedOrigins = require('../config/allowedOrigins')

const credentials = (req, res, next) => {
    const origin = req.header.origin;
    if (allowedOrigins.includes(origin)){   // if origin is in allwedOrigin, 
        res.header('Access-Control-Allow-Credentials', true) // set this header on the response
    }
    next();
}

module.exports = credentials;