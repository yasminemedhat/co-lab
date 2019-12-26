const Colaboration = require('../../models/Colaboration');
const Colaber = require('../../models/Colaber');
const drive = require('../../services/drive');


module.exports=async (req, res) => {
    const colabID = req.params.id;

    try {
        //check if creator
        let colab = await Colaboration.findOneAndDelete({
            '_id': colabID,
            'creator': req.user.id
        }
        )
        if (colab == null) {
            colab = await await Colaboration.findOne({ '_id': colabID }, 'creator');
            if (colab == null)
                return res.status(404).json({ message: 'Collaboration not found' });
            else
                return res.status(403).json({ message: 'Only the creator can delete Collaboration' });
        }

        //remove references
        await Colaber.updateMany(
            { collaborations: { $in: [colabID] } },
            { $pull: { collaborations: colabID } },
        );


        //remove images
        if (colab.images) {
            var imageID = (colab.images[0]).match('id=(.*?)&')[1];
            var parentID = await drive.getParentFolder(imageID);

            await drive.deleteFolder(parentID);
        }



        res.send('Collaboration deleted.');
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });

    }

}