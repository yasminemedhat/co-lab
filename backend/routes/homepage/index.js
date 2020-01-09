const homepage = require('express').Router();
const auth = require("../../middleware/auth");
const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');



//@route GET    /homepage
//@description  get projects/collaborations from followings
//@access       private
homepage.get('/', auth, async (req, res) => {
    const id = req.user.id;

    //get user followers
    try {
        let following = await Colaber.findById(id).select('following -_id');
        if (!following)
            return res.status(204).json({ message: 'No followings' });

        let posts = await Project.find(
            {
                $or: [{ creator: { $in: following.following } },
                { members: { $in: following.following } }]
            },
            null, { sort: { '_id': -1 } }
        ).populate({
            path: 'members creator', select: 'firstName lastName email _id avatar',
        });

        if(!posts)
        return res.status(204).json({ message: 'No posts' });


        return res.json(posts);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' });
    }

})
module.exports = homepage;