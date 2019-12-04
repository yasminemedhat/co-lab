const mongoose=require('mongoose');
const Account=require('./Account');
const interestList=require('./InterestList');

const ColaberSchema=new mongoose.Schema({
    firstName:  { type: String, required: true},
    lastName:   { type: String, required: true},
    avatar:     { type: String},
    phone:      { type: Number},
    isSponsor:  { type: Boolean},
    isPremium:  { type: Boolean},
    job:        { type: String},
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "interestList"
    }],
    bio:        { type: String}
});

const Colaber2=Account.discriminator('Colaber',ColaberSchema);


module.exports=Colaber=mongoose.model('colaber',ColaberSchema);