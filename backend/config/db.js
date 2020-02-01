mongoose=require('mongoose');
mongoose.set('useFindAndModify', false);


//use default.json string to connect to db
//use config package
const config=require('config');
const db=config.get('mongoURI');

//connect DB
const connectDB = async()=>{
    try{
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology:true,
            useCreateIndex: true
        
        });
        console.log('MongoDB connected successfuly');
    }catch(err){
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
}

//export above function
module.exports=connectDB;
