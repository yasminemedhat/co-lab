const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');

module.exports=async(req,res)=>{
    const projectID = req.params.proj_id;
    const userID = req.user.id;
    try {
        //get project to be liked
        let project = await Project.findOne({_id: projectID}); 
        if (!project)
            return res.status(404).json({message:'Project not found'});

        //get user liking the project
        let user = await Colaber.findOne({_id: userID}).select('-password'); 
        if(!user)
            return res.status(404).json({message:'User not found'});

        //check if already liked -> if yes then unlike else like
        if(project.likes.filter(like => like.toString() === userID).length > 0)
        {
            //remove from project likes array
            project.likes.remove(userID);
            //remove from user likedProjects array
            user.likedProjects.remove(projectID);
        }
        else if(userID)
        {
            //add to project likes array
            project.likes.unshift(userID);
            //add to user likedProjects array
            user.likedProjects.unshift(projectID);
        }

        //save user and project to db
        await project.save();
        await user.save();
        res.json({project});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }

}