const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');
const { validationResult } = require('express-validator');


module.exports = async (req, res) => {

    const errors = validationResult(req);
    console.log(errors);

    //if there are missing fields
    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg});
    }

    console.log('new Project attempt');

    //pull from request
    const { name, description } = req.body;
    console.log(req.body);
  

    try {
        //create new project and save to database
        project = new Project ({
            name, 
            description,
            creator: req.user.id
        });
        await project.save();
        
        //get user and add project to the user's project list
        let user = await Colaber.findOne({_id: req.user.id}).select('-password'); 
        if (user){
            user.projects.unshift(project.id);
        }

        await user.save();
        res.json(project)

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}