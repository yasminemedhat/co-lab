const mongoose = require('mongoose');
const Project = require('./Project');

const ColaborationSchema=new mongoose.Schema({
    members:    [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}]
});

const Colaboration = Project.discriminator('Colaboration',ColaborationSchema);

module.exports  = Colaboration;
