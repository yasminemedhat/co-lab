const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const InterestsSchema=new Schema({
    interest:{type: String ,unique:true},
    
});



module.exports=Interests=mongoose.model('Interest',InterestsSchema);