const mongoose=require('mongoose');
const Account=require('./Account');

const ColaberSchema=new mongoose.Schema({
    firstName:  { type: String, required: true},
    lastName:   { type: String, required: true},
    avatar:     { type: String},
    phone:      { type: Number},
    followers:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    following:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    projects:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    collaborations:      [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaboration' }],
    workingField:        { type: String},
    interests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "interestList"
    }],
    biography:  { type: String},
    isSponsor:  { type: Boolean},
    isPremium:  { type: Boolean},
});

const Colaber=Account.discriminator('Colaber',ColaberSchema);

module.exports=mongoose.model('Colaber');