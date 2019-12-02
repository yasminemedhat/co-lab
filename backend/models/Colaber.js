const mongoose=require('mongoose');
const Account=require('./Account');

const ColaberSchema=new mongoose.Schema({
    username:   { type: String, required: true},
    firstName:  { type: String, required: true, trim: true},
    lastName:   { type: String, required: true, trim: true},
    avatar:     { type: String},
    phone:      { type: Number},
    isSponsor:  { type: Boolean, default: false},
    isPremium:  { type: Boolean, default: false},
    projects:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

const Colaber2=Account.discriminator('Colaber',ColaberSchema);


module.exports=Colaber=mongoose.model('colaber',ColaberSchema);