const Colaber = require('../../models/Colaber');
const Project = require('../../models/Project')

module.exports=async(req,res)=>{
    const id=req.user.id;

    try {
        let user=await Colaber.findOne({_id: id}).select('-password'); 
        if(!user){
            return res.status(404).send('User not found');
        }
        res.send(user);        
        
    } catch (error) {
        res.status(400).send('Server Error');
        console.log(error);
        
    }

    

    

}