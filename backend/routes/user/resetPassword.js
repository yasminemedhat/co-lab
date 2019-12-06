const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account=require('../../models/Account');


const {validationResult } = require('express-validator');


module.exports=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({message: errors.errors[0].msg});
    }
    console.log('no errors');

    var password=req.body.password;
    const {id,token}=req.body;

    let user=await Account.findOne({_id: id});
    if(!user){
        return res.status(500).json({message:'Server error.'});
    }
    console.log('User found');

    
    //decode token for authorisation: (re-authorise -> more secure)
    const secret = user.password + '-' + user._id.getTimestamp();
    
    try {
        const decoded=jwt.verify(token,secret);
    } catch (error) {
        console.log(error);
        return res.status(401).json({message:'Unauthorised request. Cannot change password.'});
        
    }

    //encrypt new password:
    const salt=await bcrypt.genSalt(10);
    password=await bcrypt.hash(password,salt);
    await Account.updateOne({_id: id},{password});
    res.send("Password changed!");

    //Because the password changed, the token will no longer be valid
    
    //@TODO : prevent user from using the same password during reset
    


};