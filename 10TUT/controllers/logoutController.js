const usersDB = {
    users: require('../model/users.json'), // this imports the users json that similates our user's db table
    setUsers: function (data) {this.users = data}
}
// this will be replaced with whichever DB technology we use in the future
const fsPromises = require('fs').promises;
const path = require ('path');


const handleLogout = async (req,res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies // looking for cookie
    if(!cookies?.jwt) return res.status(204); // A successful request which has no content to send back 
    const refreshToken = cookies.jwt 

    //Is the refreshToken in DB [We're checking]
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly : true })
        return res.sendStatus(204) 
    } 
    
    // Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = { ...foundUser, refreshToken: '' };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true});  // secure: true - only serves on https 
    res.sendStatus(204);
}

module.exports = {handleLogout}