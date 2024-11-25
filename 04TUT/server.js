// core modules being imported
const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents')
const EventEmitter = require('events')
class Emitter extends EventEmitter { }
// initialize object
const myEmitter = new Emitter()

const PORT = process.env.PORT || 3500;  // port created

const serverFile = async (filePath, contentType, response) => {
    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        response.writeHead(200, { 'Content-Type': contentType });
        response.end(data)
    } catch (err) {
        console.log(err);
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    const extension = path.extname(req.url) //extention of the request url
    let contentType;

    switch (extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    let filePath;

    if (contentType === 'text/html' && req.url === '/') {
        filePath = path.join(__dirname, 'views', 'index.html');
    } else if (contentType === 'text/html' && req.url.slice(-1) === '/') {
        filePath = path.join(__dirname, 'views', req.url, 'index.html');
    } else if (contentType === 'text/html') {
        filePath = path.join(__dirname, 'views', req.url);
    } else {
        filePath = path.join(__dirname, req.url);
    }
    // makes .html extension not required in the browser
    if (!extension && req.url.slice(-1) !== '/') filePath += '.html';

    // we want to check to serve the file
    const fileExists = fs.existsSync(filePath)

    if (fileExists) {
        // serve file
        serverFile(filePath, contentType,res)
    } else {
        // 404
        // 301 redirect
        // console.log(path.parse(filePath))
        switch (path.parse(filePath).base) {
            case 'old-page.html':
                res.writeHead(301, { 'location': '/new-page.html' })
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'location': '/' })
                res.end();
                break;
            default:
            //serve a 404 response
            serverFile(path.join(__dirname,'views', '404.html'), 'text/html', res)
        }
    }

})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));




//adding a listener for the log event
// myEmitter.on('log', (msg) => logEvents(msg))

//  myEmitter.emit('log','Log events emitted!')