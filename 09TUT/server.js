const express = require('express')
const app = express() // alternate name, server app
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsOption')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;  // port created

// custom middleware logger
app.use(logger)

//Cross Origin Resource Sharing [CORS]
app.use(cors(corsOptions))

// built-in middleware to handle urlencoded data. In other words, form data
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')));

//routes
app.use('/', require('./routes/root'))
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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
