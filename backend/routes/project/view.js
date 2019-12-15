const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const id = req.params.proj_id;

    try {
        let project=await Project.findOne({_id: id}); 
        if(!project){
            return res.status(404).json({message:'Project not found'});
        }
        res.json({project});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}