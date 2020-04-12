module.exports = function(socket,io,data){
    console.log(data)
    io.in(data.collaboration).emit('new_message',data);
    // let members = data.members;
    socket.in(data.collaboration).emit('ChatRoom', data);
}