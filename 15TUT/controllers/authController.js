const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body; //looking for a user and password
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401) //Unauthorized
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles);
        //create JWTs
        //defininf our access token we have,
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // creating a logout route to invalidate the users token
        // Saving refreshToken with current user
        foundUser.refreshToken =refreshToken;
        const result = await foundUser.save();
        console.log(result) 

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',  maxAge: 24 * 60 * 60 * 1000 }) // secure: true, // sending refresh token in an http cookie to the user   NOTE When testing a refresh cookie with thunder client it honors the cookie setting for true or not, so you'd have to take it out for thunder client testing
        res.json({ accessToken }) // sending the access token as json that the frontend developer can grab
    } else {
        res.sendStatus(401); //Unauthorized 
    }
}

module.exports = { handleLogin }