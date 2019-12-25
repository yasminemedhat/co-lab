const Colaber = require('../../models/Colaber');
const Colaboration = require('../../models/Colaboration');
const { validationResult } = require('express-validator');
const drive = require('../../services/drive');//google drive
const mongoose=require('mongoose');



module.exports = async (req, res) => {

    const errors = validationResult(req);

    //if there are missing fields
    if (!errors.isEmpty()) {
        console.log('errors');
        return res.status(400).json({ message: errors.errors[0].msg });
    }

    //pull from request
    const { name, description, link } = req.body;
    //console.log(req.body);
    //pull images
    var files;
    try {
        files = req.files;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server Error' })
    }
    const session= await mongoose.startSession()
    session.startTransaction();

    try {
        //create new project and save to database
        collaboration = new Colaboration({
            name,
            description,
            creator: req.user.id,
            link
        });        

        //save images to google drive
        var urls;
        if (files && files.length > 0) {
             urls = await drive.uploadImages(collaboration.id, files, 2);
            if (urls == null)
               {
                console.log('Error in image uploading');
                return res.status(500).json({ message: 'Server Error' });
               } 

               //push images urls to the mongoose document->
               collaboration.images=urls;

        }
       
        
        //get user and add colab to the user's project list
        let user = await Colaber.findOne({ _id: req.user.id }).select('-password');
        if (user) {
            user.collaborations.unshift(collaboration.id);
        }

        await user.save();
        await collaboration.save();
        // commit the changes if everything was successful
        await session.commitTransaction();
        return res.json(collaboration);


    } catch (error) {
        console.log(error);
        await session.abortTransaction();
        //TODO -> Delete images;
        return res.status(500).json({ message: 'Server Error' });

        //TODO: remove collaboration from user and from project db;
    }finally {
        // ending the session
        session.endSession();

      }
}