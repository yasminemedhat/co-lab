const express = require('express');
const connectDB = require('./config/db'); //Database
const path = require('path');
const drive=require('./services/drive');

//const initInterests=require('./middleware/initInterests');

//init app
const app = express();
app.use(express.json());//parsing
app.use(express.urlencoded({ extended: true }));

//allow requests from any origin
var cors = require('cors');
app.use(cors());



//configure and connect database
connectDB();

//connect Drive
drive.connectDrive();

//initialise intersts (ONE TIME ONLY)
//already initialised and therefore function is no longer needed
//initInterests();

//connect all routes
app.use('/', require('./routes'));


// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('../client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
    });
}

//listen
const PORT = process.env.PORT || 5000;
const REDIS_PORT=process.env.PORT || 6379;


//for token blacklisting
//must start redis-server in another terminal
module.exports=require('redis').createClient();



app.listen(PORT, () => console.log(`Server started on port ${PORT}`));