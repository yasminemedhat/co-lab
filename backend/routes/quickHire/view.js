const QuickHire = require('../../models/QuickHire')

module.exports=async(req,res)=>{
    const id = req.params.hire_id;

    try {
        let quickHire=await QuickHire.findOne({_id: id})
                                        .populate('employer', 'firstName lastName id')
                                        .populate('employee', 'firstName lastName id'); 
        if(!quickHire){
            return res.status(404).json({message:'Quick-Hire not found'});
        }
        res.json({quickHire});       

    } catch (error) {
        res.status(500).json({message:'Server Error'});
        console.log(error);

    }
}