const Colaboration = require('../../models/Colaboration');
const drive = require('../../services/drive');
module.exports = async (req, res) => {
    const id = req.params.id;
    const colaberID = req.user.id;


    try {
        //get colaboration from DB 
        let colaboration =await Colaboration.findById(id);
        if (!colaboration) {
            return res.status(404).json({ message: 'Colaboration not found' });
        }
        //check if colaber is a member:
        if (!colaboration.members.includes(colaberID)) {
            return res.status(401).json({ message: 'Unauthorized. Cannot edit colaboration.' })
        }

        //get req body
        const { name, description, link } = req.body;

        //pull images
        var files;
        files = req.files;
        console.log(`files =${files}`);

        //add new images if there are files
        if (files && files.length > 0) {
            //if old images exist, get the parent folder and upload to it
            var urls;
            if (colaboration.images.length > 0) {
                //get parent folder id
                var imageID = (colaboration.images[0]).match('id=(.*?)$')[1];
                var parentID = await drive.getParentFolder(imageID);
                urls = await drive.uploadImagesToFolder(parentID, files);
            }
            else {//create new folder and upload to it
                urls = await drive.uploadImages(id, files, 2);
            }
            if (urls == null) {
                console.log('Error in image uploading');
                return res.status(500).json({ message: 'Server Error' });
            }
            //push images urls to the mongoose document->
            colaboration.images.push({
                $each: urls
            });
        }
        //update
        if (name) colaboration.name = name;
        if (description) colaboration.description = description;
        if (link) colaboration.link = link;
        colaboration.updatedAt = Date.now();

        await colaboration.save();

        res.json({ colaboration });



    } catch (error) {
        console.log(error);
        var i = 0;
        if (urls) {
            urls.forEach(url => {//delete each image
                var id = url.match('id=(.*?)$')[1];
                drive.deleteFileByID(id);
                i++;
            });
        }
        console.log(`Deleted ${i} uploaded images`);
        res.status(500).json({ message: 'Server Error' });

    }
}