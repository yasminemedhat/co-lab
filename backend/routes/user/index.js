const user = require('express').Router();

//checks req.body for missing fields
const { check } = require('express-validator');

//database 
const interestList = require('../../models/InterestList');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');



//routes 
const register = require('./register');
const login = require('./login');

user.get('/', (req, res) => {
    res.send('User route');
});

//@route POST   user/register
//@description  register user
//@access       public->no token to access it
user.post('/register', [
    check('firstname', 'firstname is required').not().isEmpty(),
    check('lastname', 'lastname is required').not().isEmpty(),
    check('isSponsor', 'Do you want to be a sponsor?').not().isEmpty(),
    check('email', 'Please inculde a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], register);

//@route GET    user/interestsList
//@description  get list of interests for user to choose theirs
//              the chosen interests are the ones that would be shown in the discover feed
//              (customized discover)
//@access        public-> no token needed 
user.get('/interestsList',require('./interestsList'));

//@route POST   user/login
//@description  user login using email and password 
//@access        public-> no token needed 
user.post('/login', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], login);


//@route POST   user/resetPasswordRequest
//@description  When user clicks on forgot password, 
//              they will insert their email in a form
//              email is used afterwards to send link 
//              for password reset
//@access       public
user.post('/resetPasswordRequest', [
    check('email', 'Please inlude a valid email').isEmail()],
    require('./resetPasswordRequest'));

//@route GET    user/resetPassword/:id/:token
//@description  update password from reset request
//@access       auth -> using unique token created (not the usual auth)
user.get('/resetPassword/:id/:token', require('./resetPasswordForm'));


//@route POST   user/resetPassword 
//@description  update password from reset request
//@access       auth -> using unique token created (not the usual auth)
user.post('/resetPassword', [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })],
    require('./resetPassword'));


//@route POST   user/changePassword
//@description  change password from a logged-in session
//@access       auth required
user.post('/changePassword',[
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    auth],
    require('./changePassword'));

    

//@TODO:    delete an account








module.exports = user;

