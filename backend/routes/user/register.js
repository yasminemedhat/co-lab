const Colaber = require('../../models/Colaber');//DB model
const interestsList = require('../../models/InterestList');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('underscore');
const drive = require('../../services/drive');//google drive




const { validationResult } = require('express-validator');
var id,Email;

module.exports = async (req, res) => {

    const errors = validationResult(req);
    console.log(errors);

    //if there are missing fields
    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg});
    }

    console.log('new User attempt');

    //pull from request
    const { email, password,
        firstname, lastname, phone, isSponsor, interests, biography, workingField } = req.body;
        console.log(interests);
        Email=email;
    //pull image
        var avatar;
    try {
        avatar = req.file;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' })
    }


    try {
        //see if email exists
        let colaber = await Colaber.findOne({ email });
        if (colaber) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        //references for interests
        var list = [];
        if(interests)
            for (var i = 0; i < interests.length; i++) {
                console.log(interests[i]);
                interest = await interestsList.findOne({ interest: interests[i] });
                list.push(interest._id);
            }

        console.log(list);

        var url;
         //upload image
         if (avatar) {
             url=await drive.uploadAvatar(avatar,email);
            if (url == null)
            {
            
             return res.status(500).json({ message: 'Server Error' });

            }
            
        }

        colaber = new Colaber({
            email,
            password,
            firstName: firstname,
            lastName: lastname,
            phone,
            isSponsor,
            isPremium: false,
            interests: list,
            biography,
            workingField,
            avatar: url
        });
        

        console.log(colaber.interests);







        //encrypt password:
        const salt = await bcrypt.genSalt(10);
        colaber.password = await bcrypt.hash(password, salt);





        //save in database:
        await colaber.save();
        console.log('saved user in database');
        id=colaber.id;


       
        

        //to return user's data:
        var filter = 'email, firstName, lastName, isSponsor, isPremium, biography, interests, projects, job, workingField, avatar';
        var profile = _.pick(colaber, filter.split(', '));
        console.log(profile);

        


        //jwt token:
        const payload = {
            user: {
                id: colaber.id
            }
        };
        
       

        //json web token 
        jwt.sign(
            payload, config.get('jwtSecret'),
            { expiresIn: config.get('jwtExpiration') },
            (err, token) => {
                console.log('token')
                if (err) throw err;
                console.log(token);
                console.log(profile);
                res.json({ token, user: profile});
            }
        );


    } catch (error) {

        console.log(error.message);
        //ROLLBACK
        Colaber.findOneAndDelete({_id: id});
        drive.deleteAvatar(Email);
        res.status(500).json({ message: 'Server Error' });
    }



};










