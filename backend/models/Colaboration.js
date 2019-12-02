const mongoose = require('mongoose');
const Project = require('./Project');

const ColaborationSchema=new mongoose.Schema({
    members:    [{type: Schema.Types.ObjectId, ref: 'Colaber'}]
});

const Colaboration = Project.discriminator('Colaboration',ColaborationSchema);

module.exports = Colaboration = mongoose.model('colaboration',ColaborationSchema);
