const Project = require('../../models/Project');

module.exports=async(req,res)=>{
    const id=req.params.proj_id;
    try {
        //get project and populate reviews
        let project = await Project.findOne({_id: id}).populate('reviews');
        if(!project){
            return res.status(404).json({message:'Project not found'});
        }

        //return reviews
        reviews = project.reviews;
        res.json(reviews);
            
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}