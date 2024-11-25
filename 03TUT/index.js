const logEvents = require('./logEvents')

const EventEmitter = require('events')

class MyEmitter extends EventEmitter { }

// initialize object
const myEmitter = new MyEmitter()

//adding a listener for the log event
myEmitter.on('log', (msg) => logEvents(msg))

setTimeout(
    () => {
        // to emit the event,
        myEmitter.emit('log','Log event emitted!') // only this line works. the timeout function is not needed
    },2000
)