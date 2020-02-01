const mongoose = require('mongoose');
const Project = require('./Project');
const Colaber = require('./Colaber');

const ColaborationSchema=new mongoose.Schema({
    members:    [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    followers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}]
});

//Not tested yet
// ColaborationSchema.post('findOneAndDelete',async function(doc){
//     //remove references
//     await Colaber.updateMany(
//         { followedProjects: doc._id },
//         { $pull: { followedProjects: doc._id } },
//         { $new : true}
//     );
// })

const Colaboration = Project.discriminator('Colaboration',ColaborationSchema);

module.exports  = Colaboration;
