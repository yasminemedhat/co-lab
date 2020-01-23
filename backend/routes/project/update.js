const Project = require('../../models/Project');
const drive = require('../../services/drive');

module.exports = async (req, res) => {
    const id = req.params.proj_id;


    try {
        //get project from database
        let project = await Project.findOne({ _id: id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        //get req body
        const {
            name, description, link } = req.body;

        //pull images
        var files;
        files = req.files;
        console.log(`files =${files}`);


        //add new images if there are files
        if (files && files.length > 0) {
            //if old images exist, get the parent folder and upload to it
            var urls;
            if (project.images.length>0) {
                //get parent folder id
                var imageID = (project.images[0]).match('id=(.*?)&')[1];
                var parentID = await drive.getParentFolder(imageID);
                urls = await drive.uploadImagesToFolder(parentID, files);
            }
            else {//create new folder and upload to it
                urls = await drive.uploadImages(project._id, files, 1);
            }
            if (urls == null) {
                console.log('Error in image uploading');
                return res.status(500).json({ message: 'Server Error' });
            }

            //push images urls to the mongoose document->
            project.images.push({
                $each: urls
            });
        }

        //update
        if (name) project.name = name;
        if (description) project.description = description;
        if (link) project.link = link;
        project.updatedAt = Date.now();

        await project.save();

        res.json({ project });

    } catch (error) {
        console.log(error);
        var i = 0;
        if(urls){
        urls.forEach(url => {//delete each image
            var id = url.match('id=(.*?)&')[1];
            drive.deleteFileByID(id);
            i++;
        });}
        console.log(`Deleted ${i} uploaded images`);
        res.status(500).json({ message: 'Server Error' });

    }
}