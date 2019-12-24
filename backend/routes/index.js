const routes=require('express').Router();

const user=require('./user');


//test route
routes.get('/',(req,res)=>{
    res.send('Router running');
});



routes.use('/user',require('./user'));
routes.use('/project',require('./project'));
routes.use('/collaboration',require('./collaboration'));



module.exports=routes;