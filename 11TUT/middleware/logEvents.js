// console.log('testing!')

const {format} = require ('date-fns') // importing format from the date-fns module
const { v4:uuid } = require('uuid')  // importing v4... from the uuid module  

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)
    try {
        if(!fs.existsSync(path.join(__dirname,'..', 'logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..', 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname,'..', 'logs', logName), logItem)
    }catch (err) {
        console.log(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method} \t ${req.headers.origin}\t${req.url}`, 'reqLog.txt')  //params of logEvents(a,b) - first is the message and second is the file to write to or create
    // req.headers.origin - where(origin) the request is coming from 
    // eg. GET method from Google.com requesting the Index page
    console.log(`${req.method}  ${req.path}`)
    next();
}

module.exports = {logger, logEvents};

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))

console.log(uuid())
console.log()