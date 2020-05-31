const Colaber = require('../../models/Colaber');

module.exports=async(req,res)=>{
    const id=req.params.user_id;
    try {
        //get user and populate reviews
        let user=await Colaber.findOne({_id: id}).select('-password').populate('reviews') 
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        //return reviews
        reviews = user.reviews;
        res.json(reviews);
            
    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}