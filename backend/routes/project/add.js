const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project');
const { validationResult } = require('express-validator');
const drive = require('../../services/drive');//google drive



module.exports = async (req, res) => {

    const errors = validationResult(req);

    //if there are missing fields
    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    console.log('new Project attempt');

    //pull from request
    const { name, description } = req.body;
    console.log(req.body);
    //pull images
    var files;
    try {
        files = req.files;
        console.log(`files =${files}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' })
    }

    try {
        //create new project and save to database
        project = new Project({
            name,
            description,
            creator: req.user.id
        });
        console.log("User: " + req.user.id );
        

        //save images to google drive
        var urls;
        if (files && files.length > 0) {
             urls = await drive.uploadImages(project._id, files,1);
            if (urls == null)
               {
                console.log('Error in image uploading');
                return res.status(500).json({ message: 'Server Error' });
               } 

               //push images urls to the mongoose document->
               project.images=urls;

        }
        
        //get user and add project to the user's project list
        let user = await Colaber.findOne({ _id: req.user.id }).select('-password');
        if (user) {
            user.projects.unshift(project.id);
        }

        await user.save();
        await project.save();
        res.json(project);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
        //TODO: remove project from user and from project db;
    }
}