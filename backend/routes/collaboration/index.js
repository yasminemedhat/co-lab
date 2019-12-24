const collaboration = require('express').Router();
const multer = require('multer');
const upload = multer(); //multer handles images because json doesn't support binary files
const drive = require('../../services/drive');
const { check } = require('express-validator');
const auth = require("../../middleware/auth");
const Colaboration = require('../../models/Colaboration');


//test route
collaboration.get('/', (req, res) => {
    res.send('Collaboration routes');
})

//@route POST      collaboration/create
//@description     colaber creates a project     
//@access          auth needed
collaboration.post('/create', [
    upload.array('photos'),//max number of pics->10
    check('name', `Please enter collaboration's name`).not().isEmpty(),
    auth
], require('./create'));

//@route PATCH      collaboration/:id/addColaber
//@description      add other collabers to collaboration   
//@access           auth needed + must be a member of collaboration
collaboration.patch('/:id/addColaber', [
    auth,
    check('email', 'Please enter a valid email').isEmail()
], require('./addColaber'));


//@route GET        collaboration/:id/
//@description      get collaboration data   
//@access           auth needed 
collaboration.get('/:id', [
    auth,
], async(req,res)=>{
    try {
        let colab=await Colaboration.findOne({_id:req.params.id})
    .populate('members','firstName lastName email _id avatar');
    console.log(colab);
    if(colab==null){
        return res.status(400).json({message: 'Collaboration not found'});   

    }
    res.send(colab);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Server Error.'});   
    }
    

});




module.exports = collaboration;
