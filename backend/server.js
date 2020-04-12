const express = require('express');
const connectDB = require('./config/db'); //Database
const path = require('path');
const drive=require('./services/drive');
const socket=require('socket.io');
const http=require('http');
const join_colabs = require('./chat/join_colabs');
const send_message = require('./chat/send_message');
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
//const REDIS_PORT=process.env.PORT || 6379;


//for token blacklisting
//must start redis-server in another terminal
//module.exports=require('redis').createClient();



var server=app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//socket.io notifications
const io=socket.listen(server);



//socket listener for connections:
io.on('connection',function(socket){
    console.log(`${socket.id} connected`);

    socket.on('disconnect',function(){
        console.log(`${socket.id} disconnected`);
        
        //leaves room automatically

    });
    
    //map socket.id to user:
    socket.once('identify',function(data){
        console.log(`${socket.id} is user ${data}`);
        //Each user has a "room" with their mongodb id as its name
        //because we cannot change socket.id :)
        socket.join(data);    
    })
    
    // join collaborations rooms
    socket.on('join_colabs', join_colabs.bind(null,socket));

    // send to colab chat room
    socket.on('chatRoom_MSG', send_message.bind(null,socket,io));
        
});

exports.io=io;