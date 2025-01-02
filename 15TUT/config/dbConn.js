const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI,
        //      {
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true,
        // } THIS BLOCK OF CODE IS NO LONGER NEEDED
    )
    } catch (err) {
        console.error(err)
    }
}

module.exports = connectDB;