const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);  //if we dont (!authHeader) have an auth header or even if we do have an authheader that starts with Bearer
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // If verification fails, return 403 (Forbidden)
            req.user = decoded.UserInfo.username;  // Attach the decoded username to `req.user`
            req.roles = decoded.UserInfo.roles;
            next();  // Pass control to the next middleware/handler
        }
    )
}

module.exports = verifyJWT;