var User = require('../models/');
const interestsList = require('../../models/InterestList');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('underscore');
const drive = require('../../services/drive');//google drive

const db=config.get('mongoURI');

//connect DB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true});
const { email, password,
    firstname, lastname, phone, isSponsor, interests, biography, workingField } = req.body;
    console.log(interests);
    Email=email;
//pull image
    var avatar;
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
    url=await drive.uploadAvatar(avatar,email);
    //encrypt password:
    const salt = await bcrypt.genSalt(10);
    colaber.password = await bcrypt.hash(password, salt);

    //save in database:
    await colaber.save();