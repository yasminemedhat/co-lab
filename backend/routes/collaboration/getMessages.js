const Colaber = require('../../models/Colaber');
const Collaboration = require('../../models/Colaboration');
const GroupMessage = require('../../models/GroupMessage');
const { validationResult } = require('express-validator');

module.exports = async  (req, res) => {
    //if there are missing fields
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    //get parameters from request
    const sender = req.user.id;
    const collaboration = req.params.id;

    try {
        //check if colaber has the right to send messages
        console.log(collaboration);
        let user = await Colaber.findOne({
            _id: sender,
            collaborations: collaboration
        }).select('-password');
        console.log(user);
        if (!user)
            return res.status(403).json({ message: 'Unauthorized' });

        //get collaboration
        let colab=await Collaboration.findOne({_id: collaboration});
        if(!colab){
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        //create chat message
        let messages=await GroupMessage.where({collaboration: collaboration}).sort('createdAt').limit(20)

        res.send(messages);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });

    }



}