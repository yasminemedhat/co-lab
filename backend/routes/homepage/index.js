const homepage = require("express").Router();
const auth = require("../../middleware/auth");
const Colaber = require("../../models/Colaber");
const Project = require("../../models/Project");
const ObjectId = mongoose.Types.ObjectId;

//@route GET    /homepage
//@description  get projects/collaborations from followings
//@access       private
homepage.get("/", auth, async (req, res) => {
	const id = req.user.id;
	var lastSeen = req.query.lastSeen; //get last seen post from frontend
	//get user's followers
	try {
		let following = await Colaber.findById(id).select("following -_id");
		if (!following) return res.status(204).json({ message: "No followings" });
		//construct match query to avoid having 2 separate queries
		if (lastSeen != null) {
			//in case this isn't the user's first request
			var matchQuery = {
				$and: [
					{
						_id: { $lt: ObjectId(lastSeen) },
					},
					{
						$or: [
							{ creator: { $in: following.following } },
							{ members: { $in: following.following } },
						],
					},
				],
			};
		} else {
			//first request
			var matchQuery = {
				$or: [
					{ creator: { $in: following.following } },
					{ members: { $in: following.following } },
				],
			};
		}
		var posts = await Project.aggregate([
			{
				$match: matchQuery,
			},
			{
				$sort: { _id: -1 },
			},
			{
				$limit: 20,
			},
			{
				$project: {
					name: 1,
					description: 1,
					creator: 1, //select fields and count
					images: 1,
					projectType: 1,
					likes: { $size: { $ifNull: ["$likes", []] } },
				},
			},
		]);
		await Colaber.populate(posts, {
			path: "creator",
			select: { firstName: 1, lastName: 1, email: 1, _id: 1, avatar: 1 },
		});
		if (!posts) return res.status(204).json({ message: "No posts" });
		lastSeen = posts.slice(-1)[0]._id;
		return res.json({ posts: posts, lastSeen: lastSeen });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error" });
	}
});
module.exports = homepage;
