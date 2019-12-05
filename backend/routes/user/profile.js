const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const id=req.user.id;

    try {
        let user=await Colaber.findOne({_id: id}).select('-password'); 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.json({user});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }





}