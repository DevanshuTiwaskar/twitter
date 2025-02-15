const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    tweet: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        trim: true
    }
}, { timestamps: true });//timestamps is for the created at and updated at

const Tweet = mongoose.model('tweet', tweetSchema);
//('tweet') is the name of the collection and tweetSchema is the schema for the collection

module.exports = Tweet;

