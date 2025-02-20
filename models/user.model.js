const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        // unique: true,
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
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
//('user') is the name of the collection and userSchema is the schema for the collection

module.exports = User;

