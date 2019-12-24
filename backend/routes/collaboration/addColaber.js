const Colaber = require('../../models/Colaber');
const Colaboration = require('../../models/Colaboration');
const { validationResult } = require('express-validator');

module.exports = async  (req, res) => {
    //if there are missing fields
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }


    const id = req.params.id;
    const email=req.body.email;

    try {
        //check if colaber has the right to add others
        let user = await Colaber.findOne({
            _id: req.user.id,
            collaborations: id
        })
            .select('_id');

        if (!user)
            return res.status(401).json({ message: 'Unauthorized. Cannot add Colabers.' });

        //add user
        //find Collaboration
        
        
        //find user's id
        user=await Colaber.findOne({email}).select('-password');
        if(!user)
            return res.send('Colaber not found');
            let colab=await Collaboration.findOne({_id: id});

        
        user.collaborations.addToSet(id);
        let added=colab.members.addToSet(user.id);
        if(added.length===0)
            return res.send('Colaber already a member of this Collaboration.');

        
        await user.save();
        await colab.save();
        res.send(colab);



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });

    }



}