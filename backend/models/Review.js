const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema
const ReviewSchema = new Schema({
    avatarURL:  { type: String},
    authorURL:  { type: String},
    fullName:   { type: String},
    body:       { type: String, required: true},
    createdAt:  { type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', ReviewSchema);