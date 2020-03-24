const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');
const Review = require('../../models/Review');


module.exports=async(req,res)=>{
    const projectToReview_id = req.params.proj_id;
    const reviewer_id = req.user.id;
    try {
                
        //get project to be reviewed
        let projectToReview = await Project.findOne({_id: projectToReview_id}).select('-password'); 
        if(!projectToReview){
            return res.status(404).json({message:'Project not found'});
        }

        //get reviewer
        let reviewer = await Colaber.findOne({_id: reviewer_id}).select('id');
        
        //get project owner
        const projectOwner_id = projectToReview.creator;
        let projectOwner = await Colaber.findOne({_id: projectOwner_id}).select('-password');

        if(!projectOwner | !reviewer){
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
        
        //add review to projectToReview reviews array
        projectToReview.reviews.unshift(review.id);

        //create notification object
        notification = createNotificationObject(
            (Object)(reviewer.id), fullName, projectToReview, undefined, 
            ObjectsToBeOpened.PROJECT, Actions.REVIEW_PROJECT
            );
        
        //add to receiver notifications and save in db
        projectOwner.notifications.unshift(notification.id);
        await notification.save();
        await projectOwner.save();

        server.io.to(projectOwner.id).emit('notification');

        //save project and review in db
        await review.save();
        await projectToReview.save();
        res.json(projectToReview);       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);
    }

}