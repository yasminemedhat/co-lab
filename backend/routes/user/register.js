const Colaber = require('../../models/Colaber');//DB model

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
    const { 
        email, password,
        firstname, lastname,
        phone, isSponsor, 
        hireFields, interests, 
        biography, workingField } = req.body;
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

        var url;
        //upload image
        if (avatar) {
             url=await drive.uploadAvatar(avatar,email);
            if (url == null)
            {
                return res.status(500).json({ message: 'Server Error' });
            }   
        }

        //create new colaber 
        colaber = new Colaber({
            email,
            password,
            firstName: firstname,
            lastName: lastname,
            phone,
            isSponsor,
            isPremium: false,
            interests: interests,
            hireFields,
            biography,
            workingField:workingField,
            avatar: url
        });
        

        //encrypt password:
        const salt = await bcrypt.genSalt(10);
        colaber.password = await bcrypt.hash(password, salt);

        //save in database:
        await colaber.save();
        console.log('saved user in database');
        id=colaber.id;

        //remove password
        colaber= colaber.toObject();
        delete colaber.password;
        colaber.workingField=workingField;

        //jwt token:
        const payload = {
            user: {
                id: colaber._id
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
                console.log(colaber);
                res.json({ token, user: colaber});
            }
        );
    } catch (error) {

        console.log(error.message);
        //ROLLBACK
        Colaber.findOneAndDelete({_id: id});
        if(url)
        {
            var id  = url.match('id=(.*?)$')[1];
            await drive.deleteFileByID(id);
        }
        res.status(500).json({ message: 'Server Error' });
    }
};