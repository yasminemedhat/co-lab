const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema
const ReviewSchema = new Schema({
    avatarUrl:  { type: String},
    authorUrl:  { type: String},
    fullName:   { type: String},
    body:       { type: String, required: true},
    rating:     { type: Number, default: 0},
    createdAt:  { type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);