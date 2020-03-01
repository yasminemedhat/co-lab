const Colaber = require('../../models/Colaber');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');
module.exports=async(req,res)=>{
    const userToFollow_id = req.params.user_id;
    const follower_id = req.user.id;
    try {
        //get user to be followed
        let userToFollow = await Colaber.findOne({_id: userToFollow_id}).select('-password'); 
        let follower = await Colaber.findOne({_id: follower_id}).select('-password'); 
        if(!userToFollow | !follower){
            return res.status(404).json({message:'User not found'});
        }

        //check if already followed -> if yes then unfollow else follow
        if(userToFollow.followers.filter(follow => follow.toString() === follower_id).length > 0)
        {
            //remove from userToFollow followers array
            userToFollow.followers.remove(follower_id);
            //remove from follower following array
            follower.following.remove(userToFollow_id);
        }
        else if(follower_id)
        {
            //add to userToFollow followers array
            userToFollow.followers.unshift(follower_id);
            //add to follower following array
            follower.following.unshift(userToFollow_id);

            //create notification object
            notification = createNotificationObject(
                (Object)(follower.id), follower.fullName, userToFollow, undefined, 
                ObjectsToBeOpened.SENDER, Actions.FOLLOW_USER
                );
            
            //add to receiver notifications
            userToFollow.notifications.unshift(notification.id);
            await notification.save();
            await userToFollow.save();

            server.io.to(userToFollow.id).emit('notification');

        }

        //save both users to db
        await userToFollow.save();
        await follower.save();
        res.json({userToFollow});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }

}