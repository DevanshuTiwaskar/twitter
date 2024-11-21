const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    posts: {
        type: Array,
        default: []
    }
}, { timestamps: true })//timestamps is used to store the date and time of the creation and update of the document


const User = mongoose.model('user', userSchema)

module.exports = User;