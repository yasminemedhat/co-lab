const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Project = require('./Project');
const Colaber = require('./Colaber');

const options = {
    discriminatorKey: 'userType', //for inheritance purposes
    collection: 'accounts',
};
//schema
const AccountSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, options,
);

//post remove middleware

//remove projects
AccountSchema.post("findOneAndDelete", async function (doc) {
    console.log('Account Deleted. Deleting projects..');

    if (doc) {
        const projects = await Project.find({
            creator: doc._id,
            projectType: { $ne: 'Colaboration' }
        });
        for (var i = 0; i < projects.length; i++) {
            await Project.findOneAndDelete({ _id: projects[i]._id });
        }
        console.log(`deleted ${i} projects`);
    }
});



module.exports = Account = mongoose.model('Account', AccountSchema);