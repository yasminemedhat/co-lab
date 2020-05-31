const Colaber = require('../../models/Colaber');

module.exports=async(req,res)=>{
    const id=req.params.id;
    try {
        let user=await Colaber.findOne({_id: id}).select('-password').populate('projects') 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        projects = user.projects
        res.json(projects)
            
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}