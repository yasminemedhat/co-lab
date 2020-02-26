const Colaber = require('../../models/Colaber');

module.exports=async(req,res)=>{
    const id=req.user.id;
    try {
        //get user and populate notifications
        let user=await Colaber.findOne({_id: id}).select('-password').populate('notifications') 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        //return notifications
        notifications = user.notifications;
        res.json(notifications);
            
    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}