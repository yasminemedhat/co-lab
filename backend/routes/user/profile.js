const interestList=require('../../models/InterestList');
const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const id=req.params.id;

    try {
        let user=await Colaber.findOne({_id: id}).select('-password').populate('workingField'); 
        if(!user){
            return res.status(400).json({message:'User not found'});
        }
        res.json({user});       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }





}