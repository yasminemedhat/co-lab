const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//enums
//object to be opened
const ObjectsToBeOpened = Object.freeze({
    SENDER: "sender",
    PROJECT: "project",
    COLLABORATION: "co-laboration"
  });

//action done 
const Actions = Object.freeze({
    LIKE: "liked your ",
    FOLLOW_USER: "followed you",
    FOLLOW_COLLABORATION: "followed your ",
    REVIEW_USER: "You have a new review by ",
    REVIEW_PROJECT: "reviewed your ",
    INVITATION: "invited you to join a "
});

//notification title
const Titles = Object.freeze({
    LIKE: "Like",
    FOLLOW: "Follow",
    REVIEW: "Review",
    INVITATION: "Invitation"
});

//schema
const NotificationSchema = new Schema({
    title:              {   type: String, enum: Object.values(Titles)},
    body:               {   type: String},
    sender:             {   type: Schema.Types.ObjectId, ref: 'Colaber'},
    receiver:           {   type: Schema.Types.ObjectId, ref: 'Colaber'},
    project:            {   type: Schema.Types.ObjectId, ref: 'Project'},
    objectToBeOpened:   {   type: String, enum: Object.values(ObjectsToBeOpened)},
    action:             {   type: String, enum: Object.values(Actions)},
    isOpened:           {   type: Boolean, default: false},
    date:               {   type: Date, default: Date.now},
});

  
//functions
function createNotificationObject(sender, senderFullName,
    receiver, project, 
    objectToBeOpened, action)
{
   // generate Notification body and title
   // add sender full name to notification body
    if(action != Actions.REVIEW_USER)
        body = senderFullName + " ";
    else //if action is review user 
        body = "";

   //add action to notification body
    body += action;

   // set title 
   // and add object to be opened to notification body
    switch(action){
        case Actions.LIKE:
            title = Titles.LIKE;
            body += objectToBeOpened;
            break;
        case Actions.FOLLOW_USER:
            title = Titles.FOLLOW;
            break;
        case Actions.FOLLOW_COLLABORATION:
            title = Titles.FOLLOW;
            body += objectToBeOpened;
            break;
        case Actions.REVIEW_USER:
            title = Titles.REVIEW;
            body += senderFullName;
            break;
        case Actions.REVIEW_PROJECT:
            title = Titles.REVIEW;
            body += objectToBeOpened;
            break;
        case Actions.INVITATION:
            title = Titles.INVITATION;
            body += objectToBeOpened;
            break;
   }
   body += ".";


   //create object
   return new Notification ({
       title,
       body,
       sender,
       receiver,
       project,
       objectToBeOpened, 
       action
   });

};

Object.assign(NotificationSchema.statics, {
    ObjectsToBeOpened,
    Actions, 
    createNotificationObject
  });

module.exports = Notification = mongoose.model('Notification', NotificationSchema);

