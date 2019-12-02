const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = {
    discriminatorKey: 'projectType', //for inheritance purposes
    collection: 'projects',
};
//schema
const ProjectSchema = new Schema({
    name:           {  type: String, required: true, trim: true},
    description:    {  type: String},
    rating:         {  type: Number},
    likes:          [{ type: String}],
    followers:      [{ type: String }],
    creator:        {  type: Schema.Types.ObjectId, ref: 'Colaber'}
}, options,
);

module.exports = Project = mongoose.model('Project', ProjectSchema);