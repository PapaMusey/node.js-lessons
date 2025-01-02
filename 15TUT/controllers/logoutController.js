const User = require('../model/User')


const handleLogout = async (req,res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies // looking for cookie
    if(!cookies?.jwt) return res.status(204); // A successful request which has no content to send back 
    const refreshToken = cookies.jwt 

    //Is the refreshToken in DB [We're checking]
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly : true })
        return res.sendStatus(204) 
    } 
    
    // Delete refreshToken in db
    foundUser.refreshToken = ''
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true});  // secure: true - only serves on https 
    res.sendStatus(204);
}

module.exports = {handleLogout}