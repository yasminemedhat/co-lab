const mongoose=require('mongoose');
const Account=require('./Account');
const drive=require('../services/drive');

//enums
//Interest
const Interests = Object.freeze({
    PAINTING: "Painting",
    COOKING: "Cooking",
    LITERATURE: "Literature",
    PHOTOGRAPHY: "Photography",
    FASHION: "Fashion Design",
    TUTORING:"Tutoring",
    FILM:"Film Making",
    TRANSLATING:"Translating",
    CRAFTS:"Crafts"
  });

const ColaberSchema=new mongoose.Schema({
    firstName:  { type: String, required: true},
    lastName:   { type: String, required: true},
    avatar:     { type: String},
    phone:      { type: String},
    followers:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    following:  [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaber'}],
    projects:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    followedProjects:   [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    likedProjects:      [{type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    collaborations:     [{type: mongoose.Schema.Types.ObjectId, ref: 'Colaboration' }],
    notifications:      [{type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
    workingField:       { type: String, enum: Object.values(Interests)},
    interests: [{ type: String, enum: Object.values(Interests)}],
    biography:  { type: String},
    isSponsor:  { type: Boolean},
    isPremium:  { type: Boolean},
});

//remove from followings and followers
ColaberSchema.post('findOneAndDelete', async function (doc) {
    console.log('Account Deleted. Removing follows/followings from other accounts..');
    if (doc) {
        try {
            const following = await Colaber.updateMany({ following: doc._id },
                { $pull: { following: doc._id } },
                { new: true }
            );
            if(following)
            console.log(`removed following from ${following.n} users`);

            const followers = await Colaber.updateMany({ followers: doc._id },
                { $pull: { followers: doc._id } },
                { new: true }
            );
            if(followers)
            console.log(`removed followers from ${followers.n} users`);

        } catch (error) {
            console.log(error);

        }

    }
});

//remove avatar from drive
ColaberSchema.post('findOneAndDelete', async function (doc) {
    if(doc.avatar){
        var imageID = doc.avatar.match('id=(.*?)$')[1];//get image id for deletion
        await drive.deleteFileByID(imageID);
        console.log('Deleted avatar');
    }
    else   console.log('no avatar to delete');
});

//get full name
ColaberSchema.virtual('fullName').get(function() {
    return this.firstName + ' ' + this.lastName
  })

//index for search engine
ColaberSchema
.index( {"firstName":"text", "lastname":"text", "biography":"text", "workingField":"text", "interests":"text"}, 
        {"weights": { firstName: 4, lastName:4, workingField: 4, biography:3, interests:1 }});

ColaberSchema.index({"workingField":1});

Object.assign(ColaberSchema.statics, {
    Interests
    });

const Colaber=Account.discriminator('Colaber',ColaberSchema);

module.exports=mongoose.model('Colaber');