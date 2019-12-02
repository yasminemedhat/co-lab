const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=function(req,res,next){
<<<<<<< HEAD
    const token=req.header('Authorization');

=======
    const token=req.header('Authorization').replace('Bearer ', '');
>>>>>>> add authentication to login
    if(!token){
        return res.status(401).json({message:"No token, autherization failed"});
    }
    //verify token:
    try {
        const decoded=jwt.verify(token,config.get('jwtSecret'));
        req.user=decoded.user;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
        
    }
    
};

//from http://www.codeharvest.io/web-dev/create-secure-login-signup-using-express-and-jwt/