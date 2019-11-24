const express=require('express');
const connectDB=require('./config/db'); //Database


//init app
const app=express();
app.use(express.json());//parsing

//allow requests from any origin
var cors = require('cors');
app.use(cors());

//configure and connect database
connectDB();

//connect all routes
app.use('/',require('./routes'));





//listen
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server started on port ${PORT}`));