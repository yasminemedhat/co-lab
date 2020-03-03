const routes=require('express').Router();

const user=require('./user');
const interests=require('../models/InterestList');


//test route
routes.get('/',(req,res)=>{
    res.send('Router running');
});

routes.get('/interest',async(req,res)=>{
    //req body: id 
    var interest;
    try {
        interest=await interests.findById(req.body.id).select('interest -_id')
        console.log(interest);
    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error')
    }
    res.send(interest);
})



routes.use('/user',require('./user'));
routes.use('/project',require('./project'));
routes.use('/collaboration',require('./collaboration'));
routes.use('/homepage',require('./homepage'));





module.exports=routes;