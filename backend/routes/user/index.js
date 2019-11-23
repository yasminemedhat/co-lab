const user=require('express').Router();

//checks req.body for missing fields
const { check } = require('express-validator');


//routes 
const register=require('./register');

user.get('/',(req,res)=>{
    res.send('User route');
});

//@route POST   user/register
//@description  register user
//@access       public->no token to access it
user.post('/register',[
    check('username', 'username is required').not().isEmpty(),
    check('firstname', 'firstname is required').not().isEmpty(),
    check('lastname', 'lastname is required').not().isEmpty(),
    check('isSponsor', 'Do you want to be a sponsor?').not().isEmpty(),
    check('email', 'Please inculde a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],register);

module.exports=user;

