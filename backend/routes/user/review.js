const Colaber = require('../../models/Colaber');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');
const Review = require('../../models/Review');


module.exports=async(req,res)=>{
    const userToReview_id = req.params.user_id;
    const reviewer_id = req.user.id;
    try {
                
        //get user being reviewed and reviewer
        let userToReview = await Colaber.findOne({_id: userToReview_id}).select('-password'); 
        let reviewer = await Colaber.findOne({_id: reviewer_id}).select('id'); 
        if(!userToReview | !reviewer){
            return res.status(404).json({message:'User not found'});
        }

        //pull from request
        const { 
            avatarURL, 
            authorURL, 
            fullName, 
            body, 
            createdAt} = req.body;

        //check body
        if(body==null)
            return res.status(400).json('Review field empty');

        //create review 
        let review = new Review ({
            avatarURL, 
            authorURL, 
            fullName, 
            body, 
            createdAt
        });
        
        //add review to userToReview reviews array
        userToReview.reviews.unshift(review.id);

        //create notification object
        notification = createNotificationObject(
            (Object)(reviewer.id), fullName, userToReview, undefined, 
            ObjectsToBeOpened.SENDER, Actions.REVIEW_USER
            );
        
        //add to receiver notifications and save
        userToReview.notifications.unshift(notification.id);
        await notification.save();
        await userToReview.save();

        server.io.to(userToReview.id).emit('notification');

        //save review and receiver to db
        await review.save();
        await userToReview.save();
        res.json(userToReview);       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);
    }

}