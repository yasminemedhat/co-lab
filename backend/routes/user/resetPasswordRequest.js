const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const Account=require('../../models/Account');

const { validationResult } = require('express-validator');


module.exports = async (req, res) => {
    console.log('Reset password attempt');

    const errors = validationResult(req);
    console.log(errors);
    //in case of errors
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(400).json({ message: errors.array()});
    }
    console.log('no errors');


    const email = req.body.email;
    try {
        let user = await Account.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email Does not exist' });
        }

        const payload = {
            user: {
                id: user._id,
            }
        };


        //create auth token

        //use user's hashed password as secret -> more secure
        //add timestamp to make token more unique
        const secret = user.password + '-' + user._id.getTimestamp(); //timestamp-> created at
        //console.log(user._id.getTimestamp());
        //console.log('jwt done');

        const token = jwt.sign(payload, secret,{expiresIn: 2700});
        console.log(token);
        console.log(user._id);
        console.log(secret);

        //current URL:
        var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        console.log(fullUrl);
        fullUrl=fullUrl.replace('Request','');



        var message = 'To change your password, click the link below.'
            + ' If you did not request a password change, please ignore this email ' ;
        
        message=message.concat(message,
            fullUrl,'/',user.id,'/',
            token,' Link expires in 2 hours.');
        console.log(message);
        console.log('token ahe');
        console.log(token);
        
        //send email:
        let transport = nodemailer.createTransport({
            service: 'gmail',
            secure: false, // use SSL
            auth: {
                user: "colabmail.2019@gmail.com",
                pass: "Colabssp2019"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        console.log('ab3at?');


        var mailOptions = {
            from: 'colab@colab.com',
            to: user.email,
            subject: 'DO NOT REPLY. Password Reset',
            text: message

        };
        console.log(mailOptions);
        transport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Server Error. Please try again.' });
            } else {
                console.log('Email sent');
                res.send('<p>To reset your password, please check your email</p>');
            }

        });




    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });

    }



};
