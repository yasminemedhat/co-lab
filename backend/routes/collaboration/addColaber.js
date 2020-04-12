const Colaber = require('../../models/Colaber');
const Collaboration = require('../../models/Colaboration');
const { validationResult } = require('express-validator');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');

const server=require('../../server');

module.exports = async  (req, res) => {
    //if there are missing fields
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    //get parameters from request
    const user_ID = req.user.id;
    const collaboration_ID = req.params.id;
    const newMember_Email = req.body.email;

    try {
        //check if colaber has the right to add others
        console.log("ID: ");
        console.log(user_ID);
        console.log(collaboration_ID);
        let user = await Colaber.findOne({
            _id: user_ID,
            collaborations: collaboration_ID
        }).select('-password');
        console.log(user);
        if (!user)
            return res.status(403).json({ message: 'Unauthorized. Cannot add Colabers.' });

        //get new member
        let newMember = await Colaber.findOne({email: newMember_Email}).select('-password');
        if(!newMember)
            return res.status(404).send('User not found');

        //get collaboration
        let colab=await Collaboration.findOne({_id: collaboration_ID});
        if(!colab){
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        //add collaboration reference to new member
        newMember.collaborations.addToSet(collaboration_ID);

        //add new member reference to collaboration
        let added = colab.members.addToSet(newMember.id);
        if(added.length===0)
            return res.send('Colaber already a member of this Collaboration.');

        //update updatedAt date
        colab.updatedAt=Date.now();

        console.log(user.id);
        console.log(user.fullName);
        console.log(newMember.id);
        console.log(collaboration_ID);
        console.log(ObjectsToBeOpened.COLLABORATION);
        console.log(Actions.INVITATION);

        //create notification object
        notification = createNotificationObject(
            (Object)(user.id), user.fullName, newMember.id, collaboration_ID,undefined, 
            ObjectsToBeOpened.COLLABORATION, Actions.INVITATION
            );
        
        //add to receiver notifications
        newMember.notifications.unshift(notification.id);
        await notification.save();
        await newMember.save();

        await colab.save();
        res.send(colab);
        server.io.to(newMember.id).emit('notification');


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });

    }



}