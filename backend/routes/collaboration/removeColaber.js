const Colaber = require('../../models/Colaber');
const Collaboration = require('../../models/Colaboration');

module.exports = async (req, res) => {
    const { colaberID, email } = req.body;
    const collaborationID = req.params.id;
    try {
        //check if request is made by creator or if member wants to remove themselves
        let colab = await Collaboration.findOne({ '_id': collaborationID }, 'creator members');
        if (colab == null) {
            return res.status(404).json({ message: 'Collaboration not found' });
        }
        //get colaber's profile:
        var query;
        if (email != null) {
            query = {'email': email};
        }
        else if (colaberID != null) {
            query = {'_id': colaberID};
        }
        else
            return res.status(400).json({ message: 'Missing Parameters' });

        let colaber = await Colaber.findOne(query,'collaborations');
        if (colaber == null)
            return res.status(404).json({ message: 'Co-laber not found' });


        if ((colab.creator != req.user.id) && (colaber.id!=req.user.id))
            return res.status(403).json({ message: 'Only the creator of this collaboration can remove members' });

        

        colab.members.pull(colaber.id);
        colaber.collaborations.pull(collaborationID);

        await colab.save();
        await colaber.save();

        console.log(colaber);
    
        res.json(colab);


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }

}