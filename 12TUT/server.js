require('dotenv').config();
const express = require('express')
const app = express() // alternate name, server app
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const PORT = process.env.PORT || 3500;  // port created
//Connect to Mongoose
connectDB();

// custom middleware logger
app.use(logger)

// Handle options credentials check before CORS
// and fetch cookies credentials requirement
app.use(credentials);


//Cross Origin Resource Sharing [CORS]
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data. In other words, form data
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser())

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))
// any line that should not be verified with JWT should be above this line

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'))

app.get('/', (req, res) => {
    // res.sendFile('./views/index.html', { root:__dirname }); 
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, ('new-page.html'));
})


app.all('*', (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (req.accepts('json')){
        res.json({ error: "404 Not Found"})
    } else {
        res.type('txt').send("404 Not Not Found");
    }
})

//app.use is for middleware and does not accept rejex and app.all is more for 
// routing and would apply to http methods at once
app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
