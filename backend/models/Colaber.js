const mongoose=require('mongoose');
const Account=require('./Account');

const ColaberSchema=new mongoose.Schema({
    username:   { type: String, required: true},
    firstName:  { type: String, required: true},
    lastName:   { type: String, required: true},
    avatar:     { type: String},
    phone:      { type: Number},
    isSponsor:  { type: Boolean},
    isPremium:  { type: Boolean}
});

const Colaber2=Account.discriminator('Colaber',ColaberSchema);


module.exports=Colaber=mongoose.model('colaber',ColaberSchema);