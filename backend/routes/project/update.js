const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const id = req.params.proj_id;

    try {
        //get project from database
        let project = await Project.findOne({_id: id}); 
        if(!project){
            return res.status(404).json({message:'Project not found'});
        }  
        
        //get req body
        const {
            name, description, link} = req.body;

        //update
        if (name) project.name = name;
        if (description) project.description = description;
        if (link) project.link = link;

        await project.save();

        console.log(project);
        res.json({project});

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}