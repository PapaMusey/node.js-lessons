const express = require('express')
const app = express() // alternate name, server app
const path = require('path');
const PORT = process.env.PORT || 3500;  // port created

app.get('/', (req, res) => {
    // res.sendFile('./views/index.html', { root:__dirname }); //filepath, option .... any of these two ways are used
    res.sendFile(path.join(__dirname, 'views', 'index.html')); //any of these two ways are used
})

app.get('/new-page(.html)?', (req, res) => { // this makes .html optional in the request
    res.sendFile(path.join(__dirname, 'views', 'new-page.html')); 
})
app.get('/old-page(.html)?', (req, res) => { // this makes .html optional in the request
    res.redirect(301,('new-page.html'));  //302 will be sent by defualt but would not get the                                          
})                                        // search engine to change saying its a permanent redirect but 301 will 


//Route handlers
app.get('/hello(.html)?', (req, res, next ) => { 
    console.log("attempted ....")
    next()
},    (req, res) => {
    res.send('Hello'); 
    }
);

// chaining route handlers
const one = (req,res,next) => {
    console.log('one')
    next()
}
const two = (req,res,next) => {
    console.log('two')
    next()
}
const three = (req,res) => {
    console.log('three')
    res.send('Finished')
}

app.get('/chain(.html)?', [one,two,three]);


app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); 
})


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
