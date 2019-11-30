const Colaber=require('../../models/Colaber');//DB model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


const {validationResult } = require('express-validator');

module.exports=async (req,res)=>{

    const errors=validationResult(req);
    console.log(errors);

    //if there are missing fields
    if(!errors.isEmpty()){
        console.log('errors');
        return res.status(400).json({message: errors.array()});
    }

    console.log('new User attempt');

    //pull from request
    const {email,password,username,
           firstname,lastname,phone,isSponsor}=req.body;
    
    try {
        //see if email exists
       let colaber=await Colaber.findOne({email}) ;
       if(colaber){
           return res.status(400).json({message: 'Email already exists'});
       }
       //see if username exists
       colaber=await Colaber.findOne({username}) ;
       if(colaber){
           return res.status(400).json({ message: 'Username already exists'});
       }

       colaber=new Colaber({
        email,
        password,
        username,
        firstName: firstname,
        lastName: lastname,
        phone,
        isSponsor,
        isPremium:  false,
    });

    //encrypt password:
    const salt=await bcrypt.genSalt(10);
    colaber.password=await bcrypt.hash(password,salt);


    //save in database:
    await colaber.save();
    console.log('saved user in database');
    

    //jwt token:
    const payload = {
        user: {
            id: colaber.id
        }
    };


    //json web token 
    jwt.sign(
        payload, config.get('jwtSecret'),
        {expiresIn:36000},
       (err,token) =>{
           if(err)throw err;
           res.json({token});
       }
    );//TEMPORARY 3600000
   

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    

    
};
    
    








