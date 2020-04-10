const quickHire = require('express').Router();
const QuickHire= require('../../models/QuickHire');

//checks req.body for missing fields
const { check } = require('express-validator');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');


//@route GET    quickHire/feed
//@description  get all quickhires related to user hire interests
//@access       auth needed 
quickHire.get('/feed', auth, require('./feed'));

//@route GET    quickHire/hire_id
//@description  view quickHire page
//@access       public 
quickHire.get('/:hire_id', require('./view'));


//@route POST   quickHire/add
//@description  add quickHire to user 
//@access       auth needed 
quickHire.post('/create', [
    check('title', 'Please enter Quick Hire title.').not().isEmpty(),
    check('date', 'Please enter Quick Hire date.').not().isEmpty(),
    auth
], require('./create'));

//@route PUT    quickHire/follow
//@description  accept quick hire
//@access       auth needed
quickHire.put('/accept/:quickHire_id', auth, require('./accept'));

//@route POST   quickHire/delete
//@description  delete quickHire
//@access       auth needed 
//quickHire.delete('/delete/:hire_id', auth, require('./delete'));

//@route PATCH  quickHire/update
//@description  update quickHire
//@access       auth needed  
//quickHire.patch('/update/:hire_id',auth, require('./update'));

module.exports = quickHire;