const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const { validationResult } = require('express-validator');


module.exports = async (req, res) => {
    console.log('Reset password attempt');

    const errors = validationResult(req);
    console.log(errors);
    //in case of errors
    if (!errors.isEmpty) {
        return res.status(400).json({ message: errors.array().toString });
    }
    console.log('no errors');


    const email = req.body.email;
    try {
        let user = await Account.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Email Does not exist' }] });
        }

        const payload = {
            user: {
                id: user.id,
            }
        };


        //create auth token

        //use user's hashed password as secret -> more secure
        //add timestamp to make token more unique
        const secret = user.password + '-' + Date.now();
        //const token = jwt.sign(payload, secret,{expiresIn: 2700});
        //console.log(token);
        //console.log('jwt done');

        const token = jwt.sign(payload, secret,{expiresIn: 2700}) 



        var message = 'To change your password, click the link below.'
            + ' If you did not request a password change, please ignore this email ' ;
        
        message=message.concat(message,token,' Link expires in 2 hours.');
        console.log(message);
        
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
                console.log("Done");
                res.send("To reset your password, please check your email");
            }

        });



    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });

    }



};
