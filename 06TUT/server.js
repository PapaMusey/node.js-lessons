const express = require('express')
const app = express() // alternate name, server app
const path = require('path');
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500;  // port created

// custom middleware logger
const whitelist = ['https://www.yoursite.com']
app.use(logger)

//Cross Origin Resource Sharing [CORS]
app.use(cors())

// built-in middleware to handle urlencoded data
//in other words, form data
// 'content-type: application/x-www-from-urlencoded' 
app.use(express.urlencoded({ extended: false }));

// built in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname,'/public')));

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

//Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log("attempted ....")
    next()
}, (req, res) => {
    res.send('Hello');
}
);

// chaining route handlers
const one = (req, res, next) => {
    console.log('one')
    next()
}
const two = (req, res, next) => {
    console.log('two')
    next()
}
const three = (req, res) => {
    console.log('three')
    res.send('Finished')
}

app.get('/chain(.html)?', [one, two, three]);


app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
