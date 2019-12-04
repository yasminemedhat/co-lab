const Colaber=require('../../models/Colaber');//DB model
const interestsList=require('../../models/InterestList');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const _=require('underscore')


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
    const {email,password,
           firstname,lastname,phone,isSponsor,interests,bio}=req.body;
    
    try {
        //see if email exists
       let colaber=await Colaber.findOne({email}) ;
       if(colaber){
           return res.status(400).json({message: 'Email already exists'});
       }

       //references for interests
       var list=[];
       for(var i=0;i<interests.length;i++){
           interest=await interestsList.findOne({interest: interests[i]});
           list.push(interest._id);
       }
       
        console.log(list);
        
       colaber=new Colaber({
        email,
        password,
        firstName: firstname,
        lastName: lastname,
        phone,
        isSponsor,
        isPremium:  false,
        interests:list,
        bio
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
    //to return user's data:
    var filter='email, firstName, lastName, isSponsor, isPremium';
    var profile=_.pick(colaber,filter.split(', '));
    console.log(profile);

    //json web token 
    jwt.sign(
        payload, config.get('jwtSecret'),
        {expiresIn:36000},
       (err,token) =>{
           if(err)throw err;
           res.json({token,user});
       }
    );//TEMPORARY 3600000
   

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
    

    
};
    
    








