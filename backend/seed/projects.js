var Project = require('../models/Project');
var Colaber = require('../models/Colaber');
var mongoose = require('mongoose');
var config = require('config');
var _ = require('underscore');
var faker = require('faker');

var included_interests = ["Painting", "Film Making", "Fashion Design", "Photography", "Cooking"]
var baseURL = config.get('awsS3');

function subset(arr) {
    return _.sample(arr, _.random(arr.length/10));
}

async function getInterestsList() {
    var interestsArray = ["Painting","Cooking","Literature","Photography","Fashion Design","Tutoring","Film Making","Translating","Crafts"];
    // list = await interestsList.find({}, {_id:1, interest: 1},{limit: 50}, function (err, interests) {
    //     if (interests) {
    //         interestsArr = interests;
    //     }else if(err){
    //         console.log(err);
    //     }
    // });
  return interestsArray;
}
async function getUsersWithInterest(interest) {
    // list = await Colaber.find({workingField: interestId}, {_id:1}).limit(50);
    list = await Colaber.find({workingField: interest}, {_id:1}).limit(50);
    return list;
}
async function getUsers() {
    var list = await Colaber.find({}, {_id:1})
    return list;
}

async function addProjectToUser(id,projectId) {
    var colaber = await Colaber.findOne({_id:id});
    if (colaber) {
        colaber.projects.unshift(projectId);
    }
    await colaber.save();
}

const likeProject = async (projectId, likers)=>{
    console.log("getting liked");
    for(let index=0; index<likers.length; index++){
        liker = await Colaber.findOne({_id: likers[index]}).select('-password');
        if(liker && !liker.likedProjects.includes(projectId)){
            liker.likedProjects.unshift(projectId);
        }
        await liker.save(function(err){
            if(err){}
        });
    }
}

async function createProject(userId, interest, users){
    var name = faker.commerce.productName();
    var likers = subset(users);
    project = new Project({
        name: name,
        description : faker.lorem.sentence(),
        creator: userId,
        // images: imagesArr,
        fields: [interest],
        likes: likers
    });
    await project.save();
    console.log("saved project "+ project._id);
    await addProjectToUser(userId, project._id);
    await likeProject(project._id, likers);
    return project;
}

const forLoop = async ()=> {
    console.log('Start creating projects')
    const interests = await getInterestsList();
    console.log(interests);
    // var pad = "000";
    for(let j=0;j<interests.length;j++){
        // if(included_interests.includes(interests[j].interest)){
            console.log("\n\n");
            console.log('creating projects for '+ interests[j]); //.interest);
            // var interestName = interests[j].interest.split(' ').join('+');
            const colabers = await getUsers();
            console.log(colabers.length);
            const creators = await getUsersWithInterest(interests[j]);//._id);
            console.log(creators.length);
            for (let index = 0; index < creators.length; index++) {
                console.log("creating user "+ index+ " projects")
                for(let i=0;i<2;i++){
                    // var imagePositions = [(index * 10)+(i*5)+1,(index * 10)+(i*5)+2,(index * 10)+(i*5)+3,(index * 10)+(i*5)+4,(index * 10)+(i*5)+5]
                    // var imageURL1 = baseURL + interestName + "/" +(pad.substring(0, pad.length - imagePositions[0].toString().length) + imagePositions[0].toString()) + ".jpg"
                    // var imageURL2 = baseURL + interestName + "/" +(pad.substring(0, pad.length - imagePositions[1].toString().length) + imagePositions[1].toString()) + ".jpg"
                    // var imageURL3 = baseURL + interestName+ "/" +(pad.substring(0, pad.length - imagePositions[2].toString().length) + imagePositions[2].toString()) + ".jpg"
                    // var imageURL4 = baseURL + interestName + "/" +(pad.substring(0, pad.length - imagePositions[3].toString().length) + imagePositions[3].toString()) + ".jpg"
                    // var imageURL5 = baseURL + interestName + "/" +(pad.substring(0, pad.length - imagePositions[4].toString().length) + imagePositions[4].toString()) + ".jpg"
                    // var images = [imageURL1,imageURL2,imageURL3,imageURL4,imageURL5]
                    var project = await createProject(creators[index],interests[j],colabers);
                    console.log(project.name);
                }
            }
        // }
        
    }
    console.log('done');
    completed();
}
async function main() {

    const db=config.get('mongoURI');
    mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true});
    forLoop();    
}
async function completed(){
    mongoose.disconnect();
    console.log("finished and disconnectd!!")
    process.exit();
}
main();
