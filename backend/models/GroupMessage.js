const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema
const GroupMessageSchema = new Schema({
    collaboration:   {type: Schema.Types.ObjectId, ref: 'Colaboration'},
    sender:          {type: Schema.Types.ObjectId, ref: 'Colaber'},
    sender_avatar:   {type: String},
    sender_username: {type: String},
    body:            {type: String, required: true},
    createdAt:       { type: Date, default: Date.now}
});

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);