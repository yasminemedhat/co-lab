const user=require('express').Router();

//checks req.body for missing fields
const { check } = require('express-validator');

//database 
const interestList = require('../../models/InterestList');



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


//@route GET    user/interestsList
//@description  get list of interests for user to choose theirs
//              the chosen interests are the ones that would be shown in the discover feed
//              (customized discover)
//@access        public-> no token needed 
user.get('/interestsList', async (req, res) => {
    list = await interestList.findOne({ id: 'list' }, 'interests -_id', function (err, listObject) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        else if (listObject) {
            console.log(listObject.interests);
            res.send(listObject.interests);
        }
        else {
            console.status(500).send('Something went wrong.');
        }

    });

});

module.exports=user;

