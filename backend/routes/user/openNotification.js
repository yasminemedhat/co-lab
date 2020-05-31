const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');
const QuickHire = require('../../models/QuickHire');
const Notification = require('../../models/Notification');
const { ObjectsToBeOpened } = require('../../models/Notification');


module.exports=async(req,res)=>{
    const notification_id = req.params.id;
    try {
        //get notification object
        let notification = await Notification.findOne({_id: notification_id}); 
        if(!notification){
            return res.status(404).json({message:'Notification not found'});
        }

        //set notification to opened
        notification.isOpened = true;
        notification.save();

        //switch case on object to be opened type 
        //returns colaber or project
        switch(notification.objectToBeOpened) {
            case ObjectsToBeOpened.SENDER:
                returnSender(notification.sender)
                break;
            case ObjectsToBeOpened.PROJECT:
                returnProject(notification.project);
                break;
            case ObjectsToBeOpened.COLLABORATION:
                returnProject(notification.project);
                break;
            case ObjectsToBeOpened.QUICK_HIRE:
                returnQuickHire(notification.quickHire);
                break;
            default:
                break;
        }
            
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}


async function returnProject(id) {
    let project = await Project.findOne({_id: notification.project});
    if (!project){
        return res.status(404).json({message:'Project not found'});
    }else {
        res.json(project);
    }
  }

async function returnSender(id) {
    let sender = await Colaber.findOne({_id: id}).select('-password');
    if (!sender){
        return res.status(404).json({message:'User not found'});
    }else {
        res.json(sender)
    }

}

async function returnQuickHire(id) {
    let quickHire = await QuickHire.findOne({_id: id})
                                    .populate('employee', 'firstName lastName id')
                                    .populate('employer', 'firstName lastName id');
    if (!quickHire){
        return res.status(404).json({message:'Quick-Hire not found'});
    }else {
        res.json(quickHire)
    }
}