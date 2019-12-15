const routes=require('express').Router();

const user=require('./user');


//test route
routes.get('/',(req,res)=>{
    res.send('Router running');
});



routes.use('/user',require('./user'));
routes.use('/project',require('./project'));



module.exports=routes;