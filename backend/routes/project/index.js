const project = require('express').Router();
const multer = require('multer');
const upload = multer(); //multer handles images because json doesn't support binary files
const drive = require('../../services/drive');
const Project= require('../../models/Project');

//checks req.body for missing fields
const { check } = require('express-validator');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');

//@route GET    project/view
//@description  view project page
//@access       public 
project.get('/:proj_id', require('./view'));

//@route POST   project/add
//@description  add project to user 
//@access       auth needed 
project.post('/add', [
    upload.array('photos', 10),//max number of pics->10
    check('name', 'Please enter project name').not().isEmpty(),
    auth
], require('./add'));


//@route POST   project/delete
//@description  delete project
//@access       auth needed 
project.delete('/delete/:proj_id', auth, require('./delete'));

//@route PATCH  project/update
//@description  update project
//@access       auth needed  
project.patch('/update/:proj_id',
                 [upload.array('photos'),//max number of pics->10
                  auth],
                 require('./update'));

//@route Delete  project/deleteImage
//@description   delete image from project
//@access        auth needed
project.delete('/deleteImage',auth,async(req,res)=>{
    const url=req.body.url;
    try {
        var imageID = url.match('id=(.*?)&')[1];//get image id for deletion
        await drive.deleteFileByID(imageID);
        let project=await Project.findOneAndUpdate({images: url},
             { $pull: { images: url} },
             { new: true });
        
        if(!project)return res.status(400).json({message: 'Image not found'});
        
        return res.json(project);
    } catch (error) {
        res.status(500).json({messsage: 'Server Error'});
        
    }
})


//DEVELOPMENT ROUTE -> drive cleanup
project.delete('/folder', async (req, res) => {
    if (await drive.driveCleanUp() == true) {
        res.send('Deleted successfully');
    }
    else {
        res.send('No folders were found');
    }

})

module.exports = project;