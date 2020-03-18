var Colaber = require('../models/Colaber');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('config');
var _ = require('underscore');
var faker = require('faker');


function subset(arr) {
    return _.sample(arr, _.random(arr.length));
}

async function getInterestsList() {
    var interestsArray = ["Painting","Cooking","Literature","Photography","Fashion Design","Tutoring","Film Making","Translating","Crafts"];
    // list = await interestsList.find({}, {_id:1}, function (err, interests) {
    //     if (interests) {
    //         interests.forEach(document => {
    //             interestsArray.push(document._id);
    //         });
    //     }else if(err){
    //         console.log(err);
    //     }

    // });
  return interestsArray
}
async function getUsers() {
    var usersArray = [];
    list = await Colaber.find({}, {_id:1}, function (err, colabers) {
        if (colabers) {
            colabers.forEach(document => {
                usersArray.push(document._id);
        });
        }else if(err){
            console.log(err);
        }

    });
  return usersArray;
}
async function getUser(id) {
    colaber = await Colaber.findOne({_id:id}, function (err, colaber) {
        if (colaber) {
            console.log(colaber);
        }
        else if(err){
            console.log(err);
        }

    });
  return colaber;
}
const followUsers = async (userId, usersToFollowIDs)=> {
    console.log(userId+ ' followinggg');
    for(let index=0; index<usersToFollowIDs.length; index++){
        userToFollow = await Colaber.findOne({_id: usersToFollowIDs[index]}).select('-password');
        if(userToFollow && !userToFollow.followers.includes(userId)){
            userToFollow.followers.unshift(colaber.id);
        }
        await userToFollow.save(function(err){
            if(err){}
        });
    }
    
}

const getFollowed = async (userId, followersIDs)=>{
    console.log(userId + " getting followeddd");
    for(let index=0; index<followersIDs.length; index++){
        follower = await Colaber.findOne({_id: followersIDs[index]}).select('-password');
            if(follower && !follower.following.includes(userId)){
                follower.following.unshift(userId);
            }
        await follower.save(function(err){
            if(err){}
        });
    }
}

async function createColaber(interestsArray,usersArray){
    var firstname = faker.name.firstName();
    var lastname = faker.name.lastName();
    var booleanArray = [true,false];
    var followings = subset(usersArray);
    var followers = subset(usersArray);
    var email = faker.internet.email(firstname+lastname)
    colaber = new Colaber({
        firstName: firstname,
        lastName : lastname,
        email: email,
        biography: faker.lorem.sentence(),
        workingField: faker.random.arrayElement(interestsArray),
        interests: subset(interestsArray),
        phone: faker.phone.phoneNumber(),
        avatar: faker.image.avatar(),
        isSponsor: faker.random.arrayElement(booleanArray),
        following: followings,
        followers: followers

    });
    const salt = await bcrypt.genSalt(10);
    colaber.password = await bcrypt.hash("password", salt);
    await colaber.save();
    console.log("saved"); 
    getFollowed(colaber._id, followers);
    followUsers(colaber._id, followings);
    return colaber;
}

const forLoop = async ()=> {
    console.log('Start creating users')
    const interests = await getInterestsList();
    for(let j=0;j<10;j++){
        console.log('creating batch number '+(j+1)+ ' of users');
        const colabers = await getUsers();
        for (let index = 0; index < 100; index++) {
            var colaber = await createColaber(interests, colabers)
            console.log('user created succefully '+ index+ ' '+ colaber.firstName);
          }
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
