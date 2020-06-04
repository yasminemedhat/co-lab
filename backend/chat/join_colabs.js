const Colaber = require("../models/Colaber");

module.exports = async function (socket, user_id) {
	try {
		let user = await Colaber.findOne({ _id: user_id }).select("-password");

		if (!user) {
			return;
		}
		let colabs = user.collaborations;
		colabs.map((colab_id) => {
			socket.join("colab_" + colab_id);
		});
	} catch (error) {
		console.log(error);
	}
};
