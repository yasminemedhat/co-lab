const Colaber = require('../../models/Colaber');
const Colaboration = require('../../models/Colaboration');

module.exports=async(req,res)=>{
    const projectToFollow_id = req.params.proj_id;
    const follower_id = req.user.id;
    try {
        //get project to be followed
        let projectToFollow = await Colaboration.findOne({_id: projectToFollow_id}); 
        if (!projectToFollow)
            return res.status(404).json({message:'Project not found'});

        //get follower
        let follower = await Colaber.findOne({_id: follower_id}).select('-password'); 
        if(!follower)
            return res.status(404).json({message:'User not found'});

        //check if already followed -> if yes then unfollow else follow
        if(projectToFollow.followers.filter(follow => follow.toString() === follower_id).length > 0)
        {
            //remove from projectToFollow followers array
            projectToFollow.followers.remove(follower_id);
            //remove from follower following array
            follower.followedProjects.remove(projectToFollow_id);
        }
        else if(follower_id)
        {
            //add to projectToFollow followers array
            projectToFollow.followers.unshift(follower_id);
            //add to follower following array
            follower.followedProjects.unshift(projectToFollow_id);
        }

        //save user and project to db
        await projectToFollow.save();
        await follower.save();
        res.json({projectToFollow});       

    } catch (error) {
        res.status(400).json({message:'Server Error'});
        console.log(error);

    }

}