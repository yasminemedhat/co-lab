const Colaber = require('../../models/Colaber');//DB model
const _ = require('underscore');
const drive = require('../../services/drive');//google drive

module.exports = async (req, res) => {
    const id = req.user.id;

    //get colaber
    let colaber = await Colaber.findOne({ _id: id }).select('-password');
    if(!colaber){
        return res.status(400).json('User not found')
    }

    const {
        firstname, lastname, phone, isSponsor, interests, biography, workingField } = req.body;

    var avatar;
    try {
        //pull image:
        avatar = req.file;

        //upload avatar
        var url = undefined;
        var newImageid, oldImageid;
        if (avatar) {
            //get old image id
            console.log('Uploading image');
            url = await drive.uploadAvatar(avatar, colaber.email);
            if (url == null) {//success
                console.log('error in avatar');
                return res.status(500).json({ message: 'Server Error. No changes were made' });
            }
            newImageid = url.match('id=(.*?)&')[1]; //incase we want to rollback;
            if (colaber.avatar) {
                oldImageid = (colaber.avatar).match('id=(.*?)&')[1];
            }
        }

        
        //update:
        if (firstname) colaber.firstName = firstname;
        if (lastname) colaber.lastName = lastname;
        if (url) colaber.avatar = url;
        if (interests) colaber.interests = interests;
        if (workingField) colaber.workingField = workingField;
        if (phone) colaber.phone = phone;
        if (biography) colaber.biography = biography;
        if (isSponsor) colaber.isSponsor = isSponsor;

        //save colaber
        await colaber.save();

        //delete previous image:
        if (oldImageid) drive.deleteFileByID(oldImageid);

        //return json
        res.json({ user: colaber });

    } catch (error) {
        console.log(error);

        //rollback -> remove image
        if (newImageid)
            drive.deleteFileByID(newImageid);
        return res.status(500).json({ message: 'Server Error' });
    }
}