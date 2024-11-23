const fsPromises =  require('fs').promises // importing the file system, promises
const path = require('path'); // when using the path object for the readFile
// reading the file
// fs.readFile('./files/starter.txt', 'utf8',(err, data) => {
//     if (err) throw err;
//     console.log(data.toString());
// })

// creating an async function called fileOps
const fileOps = async () => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8');  // reading data from n file
        console.log(data);
        await fsPromises.writeFile(path.join(__dirname, 'files', 'promiseWrite.txt'), data)
        await fsPromises.appendFile(path.join(__dirname, 'files', 'promiseWrite.txt'), '\nNice we met again')
        await fsPromises.rename(path.join(__dirname, 'files', 'promiseWrite.txt'), path.join(__dirname, 'files', 'promiseComplete.txt'));
        const newData = await fsPromises.readFile(path.join(__dirname, 'files', 'promiseComplete.txt'), 'utf8');
        console.log(newData);
    }catch (err) {
        console.error(err);
    }
}

fileOps();

// fs.readFile(path.join(__dirname, 'files', 'starter.txt'), 'utf8', (err, data) => {
//     if (err) throw err;
//     console.log(data);
// })

// console.log('Hello...')

// writing files
// fs.writeFile(path.join(__dirname, 'files', 'reply.txt'), 'Nice to meet you',(err) => {
//     if (err) throw err;
//     console.log('Write complete');
//     fs.appendFile(path.join(__dirname, 'files', 'reply.txt'), '\n\n Yes it is',(err) => {
//         if (err) throw err;
//         console.log('Append complete');
//         fs.rename(path.join(__dirname, 'files', 'reply.txt'), path.join(__dirname, 'files', 'newReply.txt'),(err) => {
//             if (err) throw err;
//             console.log('Rename complete');
//         })
//     })
// })



//exit on uncaught errors
process.on('uncaughtException', err => {
    console.error(`There was an uncaught error: ${err}`);
    process.exit(1);
})

