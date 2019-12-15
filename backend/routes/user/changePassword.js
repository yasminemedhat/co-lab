const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

module.exports = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.errors[0].msg });
    }


    const id = req.user.id;


    var password = req.body.password;

    //encrypt new password:
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    try {
        await Account.updateOne({ _id: id }, { password });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error.' });
    }
    res.send("Password changed!");





};