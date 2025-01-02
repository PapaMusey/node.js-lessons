const usersDB = {
    users: require('../model/users.json'), // this imports the users json that similates our user's db table
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken');
const fsPromises = require('fs').promises
const path = require('path');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body; //looking for a user and password
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required' });
    const foundUser = usersDB.users.find(person => person.username === user);
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
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username); // creates an array of the other users that are not the username that is logged in
        const currentUser = { ...foundUser, refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })  // sending refresh token in an http cookie to the user   NOTE When testing a refresh cookie with thunder client it honors the cookie setting for true or not, so you'd have to take it out for thunder client testing
        res.json({ accessToken }) // sending the access token as json that the frontend developer can grab
    } else {
        res.sendStatus(401); //Unauthorized 
    }
}

module.exports = { handleLogin }