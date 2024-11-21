const mongoose = require('mongoose');

async function connectDB() {
    await mongoose.connect("mongodb://localhost:27017/twitter");
    console.log("connected to db")
}
connectDB();

module.exports = mongoose.connection