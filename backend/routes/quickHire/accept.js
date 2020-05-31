const Colaber = require('../../models/Colaber');
const QuickHire = require('../../models/QuickHire');
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');

const server=require('../../server');
module.exports=async(req,res)=>{
    const quickHire_id = req.params.quickHire_id;
    const userID = req.user.id;
    try {
        //get the Quick-Hire
        let quickHire = await QuickHire.findOne({_id: quickHire_id}); 
        if (!quickHire)
            return res.status(404).json({message:'Quick-Hire not found'});

        //get employee
        let employee = await Colaber.findOne({_id: userID}).select('-password'); 
        if(!employee)
            return res.status(404).json({message:'User not found'});

        //get employer
        let employer = await Colaber.findOne({_id: quickHire.employer}).select('-password'); 
        if(!employer)
            return res.status(404).json({message:'User not found'});

        //check if quickHire is available
        if(quickHire.availability == false)
            return res.status(400).json({message:'Quick-Hire not available'});
        
        //add employee to quick Hire
        quickHire.employee = employee.id;
        quickHire.availability = false;

        //send notification to employer
        console.log("CREATING NOTIFICATION")
        //create notification object
        notification = createNotificationObject(
            (Object)(employee.id), employee.fullName, employer, undefined ,quickHire.id, 
            ObjectsToBeOpened.QUICK_HIRE, Actions.ACCEPT_QUICK_HIRE
        );
        
        //add to receiver notifications
        employer.notifications.unshift(notification.id);
        notification.save();
        employer.save();
        server.io.to(employer._id).emit('notification');

        //save quickHire to db
        await quickHire.save();
        res.json(quickHire);

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }

}