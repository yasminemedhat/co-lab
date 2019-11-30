const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const InterestsSchema=new Schema({
    id: String,
    interests:[String]
});



module.exports=Interests=mongoose.model('Interest',InterestsSchema);