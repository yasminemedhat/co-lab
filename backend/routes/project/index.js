const project = require('express').Router();


//checks req.body for missing fields
const { check } = require('express-validator');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');

//@route GET    project/view
//@description  view project page
//@access       public 
project.get('/view/:proj_id',require('./view'));

//@route POST   project/add
//@description  add project to user 
//@access       auth needed 
project.post('/add', [
    check('name', 'Please enter project name').not().isEmpty(),
    auth
], require('./add'));


//@route POST   project/delete
//@description  delete project
//@access       auth needed 
project.delete('/delete/:proj_id', auth, require('./delete'));

module.exports=project;