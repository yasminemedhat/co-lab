const Colaber = require('../../models/Colaber');

module.exports=async(req,res)=>{
    const id=req.params.id;

    try {
        //get user
        let user = await Colaber.findOne({_id: id}).select('-password');
        if(!user){
            return res.status(400).json({message:'User not found'});
        }

        //return json
        res.json({user});
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);
    }
}