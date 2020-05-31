const Colaber = require('../../models/Colaber');
const QuickHire = require('../../models/QuickHire');

module.exports = async(req,res)=>{

    const userID = req.user.id;
    try {

        //get user hirefields
        let user = await Colaber.findOne({ _id: userID }).select('hireFields');
        if(!user)
            return res.status(404).json({message:'User not found'});
        hireFields = user.hireFields;

        //get possible quick-hires
        let quickHires = await QuickHire.find({field: hireFields,               //has the same field as one of the colabers hire fields
                                                availability: true,             //is available
                                                date: {$gte: new Date()}})      //date is still in the future
                                        .sort({date: 1})                        //sort: quickHires with the nearest date first
                                        .populate('employer',                   //populate employer
                                                    'firstName lastName id');    

        res.json(quickHires);
        
    }catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}