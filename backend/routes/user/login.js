const Account=require('../../models/Account');//DB model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const _=require('underscore');

const {validationResult } = require('express-validator');

module.exports=async (req,res)=>{
    const errors=validationResult(req);

    //in case of errors
    if(!errors.isEmpty){
        return res.status(400).json({message: errors.errors[0].msg});
    }
    console.log('Login attempt started');

    //pull from request
    const {email,password}=req.body;
    //for security reasons in case of invalid email or password
    //we do not specify which one of them is wrong
    //to not reveal an existing user's email 
    try{
        let user=await Account.findOne({email});

        if(!user){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:'Invalid Credentials'});
        }
        //for correct credentials:
        //create a jwt token 

        const payload = {
            user: {
                id: user.id,
            }
        };
        //to return user's data:
        // var filter='email, firstName, lastName, isSponsor, isPremium, avatar, bio, workingField';
        // var profile=_.pick(user,filter.split(', '));
        // console.log(profile);
    
        //create auth token
        jwt.sign(
            payload, config.get('jwtSecret'),
            {expiresIn:config.get('jwtExpiration')},
           (err,token) =>{
               if(err)throw err;
               console.log("JWT auth from login: ", token);
               res.json({token,user});
           }
        );
        
    }
    catch(err){
        console.error(err.message);
        res.status(500).json({message:'Server Error'});
    }
    
};