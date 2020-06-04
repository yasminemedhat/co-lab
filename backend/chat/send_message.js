module.exports = function (socket, io, data) {
	io.in("colab_" + data.collaboration).emit("new_message", data);
	// let members = data.members;
	socket.in("colab_" + data.collaboration).emit("ChatRoom", data);
};
