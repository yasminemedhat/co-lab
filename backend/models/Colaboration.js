const mongoose = require('mongoose');
const Project = require('./Project');

const ColaborationSchema=new mongoose.Schema({
    members:    [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber',unique: true}]
});

const Colaboration = Project.discriminator('Colaboration',ColaborationSchema);

module.exports  = mongoose.model('Colaboration');
