// console.log('testing!')

const {format} = require ('date-fns') // importing format from the date-fns module
const { v4:uuid } = require('uuid')  // importing v4... from the uuid module  

const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    console.log(logItem)
    try {
        if(!fs.existsSync(path.join(__dirname, 'logs'))){
            await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLog.txt'), logItem)
    }catch (err) {
        console.log(err)
    }
}

module.exports = logEvents;

console.log(format(new Date(), 'yyyyMMdd\tHH:mm:ss'))

console.log(uuid())
console.log()