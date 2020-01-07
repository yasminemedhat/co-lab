const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const projId = req.params.proj_id;

    try {
        //get project from database
        let project = await Project.findOne({_id: projId}); 
        if(!project){
            return res.status(404).json({message:'Project not found'});
        }
        var images=project.images;

        console.log(project);

        //get user that created the project
        const userId = project.creator;
        console.log(userId);
        let user = await Colaber.findOne({_id: userId}); 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        //delete ref in user
        projects = user.projects;
        var i = 0;
        projects.forEach(element => {
            if (element._id == projId)
            {
                updatedProjects = projects.slice(0, i).concat(projects.slice(i + 1, projects.length));
            }
            i++;
        });
        user.projects = updatedProjects;
        await user.save();
        await project.remove();
        //remove images
        if (images) {
            var imageID = (images[0]).match('id=(.*?)&')[1];
            var parentID = await drive.getParentFolder(imageID);

            await drive.deleteFolder(parentID);
        }

        res.json({user});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }
}