const Colaber=require('../../models/Colaber');
const Project=require('../../models/Project'); //for both projects and collaborations

module.exports=async(req,res)=>{
   
    const id=req.user.id;

    try {
         //get users interests
         const interests=await Colaber.findById(id).select('interests -_id').lean();
         if(!interests)return res.status(400).json('Please specify your interests to get suggestions');

         console.log(interests.interests);
         res.json(interests);

    } catch (error) {
        console.log(error);
        return res.status(500).json('Server Error');
    }
}