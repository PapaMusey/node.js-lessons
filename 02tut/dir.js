const fs = require('fs')

if (!fs.existsSync('./new')) {
    fs.mkdir('./new', (err) => {
        if(err) throw err;
        console.log ('Directory created')
    })
} // if directory does not exist create a new one

if (fs.existsSync('./new')) {
    fs.rmdir('./new', (err) => {
        if(err) throw err;
        console.log ('Directory removed')
    })
}
// if directory exists remove