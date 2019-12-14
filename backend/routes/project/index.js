const project = require('express').Router();
const multer = require('multer');
const upload = multer(); //multer handles images because json doesn't support binary files
const drive=require('../../services/drive');

//checks req.body for missing fields
const { check } = require('express-validator');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');

//@route GET    project/view
//@description  view project page
//@access       public 
project.get('/view/:proj_id', require('./view'));

//@route POST   project/add
//@description  add project to user 
//@access       auth needed 
project.post('/add', [
    upload.array('photos',10),//max number of pics->10
    check('name', 'Please enter project name').not().isEmpty(),
    auth
], require('./add'));


//@route POST   project/delete
//@description  delete project
//@access       auth needed 
project.delete('/delete/:proj_id', auth, require('./delete'));


//DEVELOPMENT ROUTE -> drive cleanup
project.delete('/folder',async(req,res)=>{
    if(await drive.driveCleanUp()==true){
        res.send('Deleted successfully');
    }
    else{
        res.send('No folders were found');
    }

})

module.exports = project;