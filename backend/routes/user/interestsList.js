const interestList=require('../../models/InterestList');
module.exports= async (req, res) => {
    var interests = [];
    list = await interestList.find({}, '-__v -_id', function (err, listObject) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        }
        else if (listObject) {
            listObject.forEach(element => {
                interests.push(element.interest);

            });
            res.send(interests);
        }
        else {
            res.status(500).json({message:'Something went wrong.'});
        }

    });
}