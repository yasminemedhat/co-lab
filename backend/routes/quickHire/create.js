const Colaber = require('../../models/Colaber');
const QuickHire = require('../../models/QuickHire');
const { validationResult } = require('express-validator');


module.exports = async (req, res) => {

    console.log("entered");
    const errors = validationResult(req);
    console.log("Errors here");
    console.log(errors)

    //if there are missing fields
    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    console.log('New Quick Hire attempt.');


    //pull from request
    const {
        title, description,
        field, money, 
        date
    } = req.body;

    try {
        //get user 
        let employer = await Colaber.findOne({ _id: req.user.id }).select('-password');
        if(!employer)
        {
            return res.status(404).json({message:'User not found'});
        }

        //create new quick hire
        quickHire = new QuickHire({
            title, description,
            employer : employer.id,
            field, money, 
            date
        });
        
        //save to db
        await quickHire.save();
        res.json(quickHire);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}