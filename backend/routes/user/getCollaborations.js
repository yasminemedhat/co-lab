const Colaber = require('../../models/Colaber');

module.exports=async(req,res)=>{
    const id=req.user.id;

    try {
        let user=await Colaber.findOne({_id: id}).select('-password').populate('collaborations') 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        Collaborations = user.collaborations
        res.json(Collaborations)
            
    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}