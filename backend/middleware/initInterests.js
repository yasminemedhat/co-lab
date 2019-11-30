const InterestsList=require('../models/InterestList');
const connectDB=require('../config/db'); //Database

const init=()=>{
    list=new InterestsList({
        id:'list',
        interests:['Photography','Painting','Cooking','Literature','Fashion Design',
                    'Tutoring','Translating','Film Making','Crafts']
    });
    
    list.save();
    console.log('Saved interests in database');


};

module.exports=init;
