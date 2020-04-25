const Colaber = require('../../models/Colaber');
const Collaboration = require('../../models/Colaboration');
const GroupMessage = require('../../models/GroupMessage');
const { validationResult } = require('express-validator');

module.exports = async  (req, res) => {
    

    //get parameters from request
    const sender = req.user.id;
    
    const collaboration = req.params.id;
    const body = req.body.message;
    console.log(body);
    try {
        //check if colaber has the right to send messages
        let user = await Colaber.findOne({
            _id: sender,
            collaborations: collaboration
        }).select('-password');
        if (!user)
            return res.status(403).json({ message: 'Unauthorized' });

        const sender_avatar = user.avatar;
        const sender_username = user.firstName + " " + user.lastName;
        
        //get collaboration
        let colab=await Collaboration.findOne({_id: collaboration});
        if(!colab){
            return res.status(404).json({ message: 'Collaboration not found' });
        }

        //create chat message
        message = new GroupMessage({
            collaboration,
            sender,
            sender_avatar,
            sender_username,
            body
        })

        await message.save();
        res.send(message);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });

    }



}