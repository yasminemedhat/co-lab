const jwt=require('jsonwebtoken');
const config=require('config');
const redis=require('redis');
const redisClient=redis.createClient();

module.exports=function(req,res,next){
    const token=req.header('Authorization').replace('Bearer ', '');
    if(!token){
        return res.status(401).json({message:"No token, autherization failed"});
    }
    //verify token:
  
          try {
              
            const decoded =jwt.verify(token, config.get('jwtSecret'));
            console.log(token);
            redisClient.get(token,function(error,value) {
                if (error) {
                  throw error;
                } else {
                    if(value){//true->Blacklist
                        console.log('Blacklisted Token');

                        return res.status(401).json({ message: "Invalid token" });         

                    }
                    else{
                        console.log(decoded);
                        req.user=decoded.user;
                        req.exp=decoded.exp;
                        req.token=token;
                        next();
                    }
                }
              }
            );
            

          } catch (error) {
              console.log('invalid token');
           return res.status(401).json({ message: "Invalid token" });


              
          }
};

//from http://www.codeharvest.io/web-dev/create-secure-login-signup-using-express-and-jwt/