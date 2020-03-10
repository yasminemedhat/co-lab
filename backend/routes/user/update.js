const Colaber = require('../../models/Colaber');//DB model
const interestsList = require('../../models/InterestList');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('underscore');
const drive = require('../../services/drive');//google drive

module.exports = async (req, res) => {
    const id = req.user.id;

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

        //references for interests
        var list = undefined;
        if (interests != null) {
            list = [];

            for (var i = 0; i < interests.length; i++) {
                interest = await interestsList.findOne({ interest: interests[i] });
                list.push(interest._id);
            }
        }

        //workingField get id
        if(workingField){
        var work=await interestsList.findOne({interest: workingField});
        }
        console.log(work);



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
            newImageid = url.match('id=(.*?)$')[1]; //incase we want to rollback;
            if (colaber.avatar) {
                oldImageid = (colaber.avatar).match('id=(.*?)$')[1];
            }
        }

        
        //update:
        if (firstname) colaber.firstName = firstname;
        if (lastname) colaber.lastName = lastname;
        if (url) colaber.avatar = url;
        if (list) colaber.interests = list;
        if (work != null) colaber.workingField = work._id;
        if (phone) colaber.phone = phone;
        if (biography) colaber.biography = biography;
        if (isSponsor) colaber.isSponsor = isSponsor;

        await colaber.save();




        //delete previous image:
        if (oldImageid) drive.deleteFileByID(oldImageid);

        res.json({ user: colaber });



    } catch (error) {
        console.log(error);

        //rollback -> remove image
        if (newImageid)
            drive.deleteFileByID(newImageid);
        return res.status(500).json({ message: 'Server Error' });

    }




}