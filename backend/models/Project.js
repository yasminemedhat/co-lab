const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const drive = require('../services/drive');

const options = {
    discriminatorKey: 'projectType', //for inheritance purposes
    collection: 'projects',
};
//schema
const ProjectSchema = new Schema({
    name:           {  type: String, required: true, trim: true},
    description:    {  type: String},
    rating:         {  type: Number},
    likes:          [{ type: Schema.Types.ObjectId, ref: 'Colaber'}],
    creator:        {  type: Schema.Types.ObjectId, ref: 'Colaber'},
    images:         [{ type: String}],
    link:           {  type: String},
    createdAt:      {  type: Date, default: Date.now},
}, options,
);


//post delete middlewares

//remove images
ProjectSchema.post(['remove','findOneAndDelete'],async function (doc){
     //remove images
     if (doc.images) {
        var imageID = (doc.images[0]).match('id=(.*?)&')[1];
        var parentID = await drive.getParentFolder(imageID);

        await drive.deleteFolder(parentID);
        console.log(`Deleted ${doc.images.length} images`);
    }
    else console.log('No images to delete');

});

ProjectSchema
.index( {"name":"text", "description":"text"}, 
        {"weights": { name: 4, description:3}});

module.exports = mongoose.model('Project', ProjectSchema);