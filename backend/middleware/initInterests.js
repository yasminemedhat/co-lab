const InterestsList = require('../models/InterestList');
const connectDB = require('../config/db'); //Database

const interests = ['Photography', 'Painting', 'Cooking', 'Literature', 'Fashion Design',
    'Tutoring', 'Translating', 'Film Making', 'Crafts'];


const init = () => {
    interests.forEach(addToDB);

    function addToDB(item) {
        console.log(item);
        interest = new InterestsList({interest: item});
        interest.save();


    }

    console.log('Saved interests in database');


};

module.exports = init;
