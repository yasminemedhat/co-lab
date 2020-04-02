const Colaber = require('../../models/Colaber');
const QuickHire = require('../../models/QuickHire');
const { validationResult } = require('express-validator');

//notifications
const { ObjectsToBeOpened }= require('../../models/Notification');
const { Actions }= require('../../models/Notification');
const { createNotificationObject }= require('../../models/Notification');
const server=require('../../server');


module.exports = async (req, res) => {

    const errors = validationResult(req);

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

        var employees = [];
        //get potential employees
        //for each employee create notification object 
        //todo limit and send every certain amount of time
        await (
            await Colaber.find({ hireFields: field, _id: {$ne: employer.id}}).select('-password')).
            forEach(
                function (doc)
                {
                    try {
                        potential_employee = doc;
                        
                        //create notification object
                        notification = createNotificationObject(
                            (Object)(employer.id), employer.fullName, potential_employee, undefined ,quickHire.id, 
                            ObjectsToBeOpened.QUICK_HIRE, Actions.POST_QUICK_HIRE
                        );
                        
                        //add to receiver notifications
                        potential_employee.notifications.unshift(notification.id);
                        notification.save();
                        potential_employee.save();
                        server.io.to(potential_employee._id).emit('notification');
                              
                        //add to list
                        employees.push(potential_employee);
                    }catch (error) {
                        console.log(error.message);
                        //res.status(500).json({ message: 'Server Error' });
                    }
                    
                });
        
        //save to db
        await quickHire.save();
        res.json(employees);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
}