const jwt =require('jsonwebtoken');

module.exports=async(req, res)=> {
    const {id,token}=req.params;
    let user=await Account.findOne({_id: id});
    if(!user){
        return res.status(500).json({msg:'Server error.'});
    }
    //decode token for authorisation:
    const secret = user.password + '-' + user._id.getTimestamp();
    try {
        const decoded=jwt.verify(token,secret);
    } catch (error) {
        return res.status(401).json({msg:'Unauthorised request. Cannot change password.'});
        
    }
    console.log(id);
    console.log(token);
    res.send('<form action="/../user/resetPassword" method="POST">' +
        '<input type="hidden" name="id" value="' + id + '" />' +
        '<input type="hidden" name="token" value="' + token + '" />' +
        '<input type="password" name="password" value="" placeholder="Enter your new password." />' +
        '<input type="submit" value="Reset Password" />' +
    '</form>');

    
};