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
    INVITATION: "invited you to join a "
});

//notification title
const Titles = Object.freeze({
    LIKE: "Like",
    FOLLOW: "Follow",
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
   body = senderFullName + " ";

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
       case Actions.INVITATION:
           title = Titles.INVITATION;
           body += objectToBeOpened;
           break;
   }
   body += ".";
   console.log("BODY: " + body);
   console.log("Title: " + title);

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

