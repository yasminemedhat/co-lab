const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Project = require('./Project');

const options = {
    discriminatorKey: 'userType', //for inheritance purposes
    collection: 'accountsTest',
};
//schema
const AccountSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, options,
);




module.exports = Account = mongoose.model('AccountTest', AccountSchema);