const user = require('express').Router();
//checks req.body for missing fields
const { check } = require('express-validator');
// const redis=require('redis');
// const redisClient=redis.createClient();
const multer = require('multer');//image
const upload = multer(); 

//database 
const Colaber = require('../../models/Colaber');
const {Interests} = require('../../models/Colaber');
const {HireFields} = require('../../models/QuickHire');

//jwt authentication
const auth = require("../../middleware/auth");
const jwt = require('jsonwebtoken');

const drive=require("../../services/drive");


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
    upload.single('avatar'),
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
user.get('/interestsList',(req,res)=>{
    res.json(Object.values(Interests));
})

//@route GET    user/fieldsList
//@description  get list of quick hire fields for user to choose theirs 
//              the chosen fields are the ones that would be used to choose
//              which co-labers shoudl receive a specific quick hire offer
//@access       public-> no token needed 
user.get('/fieldsList',(req,res)=>{
    console.log("Here")
    console.log(Object.values(HireFields))
    res.json(Object.values(HireFields));
})

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
user.post('/changePassword', [
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    auth],
    require('./changePassword'));



//@TODO:    delete an account


//@route PUT    user/follow
//@description  follow other user
//@access       auth needed
user.put('/follow/:user_id', auth, require('./follow'));


//@route POST   user/review
//@description  review other user
//@access       auth needed
user.post('/review/:user_id', auth, require('./review'));


//@route GET    user/pullReviews
//@description  view reviews for certain user
//@access       public
user.get('/pullReviews/:user_id', require('./pullReviews'));


//@route PATCH  user/updateAccount
//@description  update an account's data
//@access       auth needed
user.patch('/update',[
    upload.single('avatar'),
    auth
], require('./update'));



//@route Get    user/profile
//@description  get user's data to show their profile
//@access       requires authentication
user.get('/profile/:id', auth, require('./profile'));

// //@route Get    user/profile/:id
// //@description  get user's data to show their profile using id
// //@access       requires authentication
// user.get('/profile/:id', require('./userProfile'));

//@route GET    user/viewProjects
//@description  view projects for certain user
//@access       requires authentication 
user.get('/viewProjects/:id', auth, require('./viewProjects'));

//@route GET    user/getCollabortions
//@description  view collaborations for certain user
//@access       requires authentication 
user.get('/getCollaborations/:id', auth, require('./getCollaborations'));

//@route Get    user/openNotification
//@description  get clicked notification
//@access       requires authentication
user.get('/openNotification/:id', auth, require('./openNotification'));

//@route GET    user/pullNotifications
//@description  view notifications for certain user
//@access       requires authentication 
user.get('/pullNotifications', auth, require('./pullNotifications'));

//@route GET    user/search
//@description  search
//@access       does not require authentication 
user.get('/search/:text', require('./search'));

//@route GET    user/search
//@description  search
//@access       does not require authentication 
user.get('/discover/:type',auth,require('./discover'));

//@route POST   user/logout ->Post because browser pre-fetches for get requests
//@description  blacklist jwt using redis
//@access       requires authentication
user.post('/logout', auth, async (req, res) => {
    console.log('logout route ');
    //get expiration and creation times
//     const exp =   req.exp;
//     const token = req.token;
//     const now = Date.now() / 1000;
//     const timeLeft = exp - now; //in seconds
//     console.log(timeLeft);
//    try {//save in blacklist.
//     redisClient.set(token, true, 'EX', Math.trunc(timeLeft),redis.print);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: 'Server Error'});       
//     }
    res.send('Logged out.');
});

//@route DELETE     /user/
//@description      delete a colaber's account
//@access           requires authentication
user.delete('/',auth,async (req,res)=>{
    try {
        let colaber=await Colaber.findByIdAndDelete(req.user.id);
        if(!colaber)return res.status(400).json({message: 'Colaber not found.'});
        //@TODO: remove followed projects?
        res.send('Colaber Deleted');
    } catch (error) {
        return res.status(500).json({message: 'Server Error'});   
    }
    
});


//test route:

user.delete('/avi',(req,res)=>{
    drive.updateAvatar('loujlouj@gmail.com');
    res.send('hi');
})



module.exports = user;

