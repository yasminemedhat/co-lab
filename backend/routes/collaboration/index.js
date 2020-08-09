const collaboration = require("express").Router();
const multer = require("multer");
const upload = multer(); //multer handles images because json doesn't support binary files
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const Colaboration = require("../../models/Colaboration");

//test route
collaboration.get("/", (req, res) => {
	res.send("Collaboration routes");
});

//@route POST      collaboration/create
//@description     colaber creates a project
//@access          auth needed
collaboration.post(
	"/create",
	[
		upload.array("photos"), //max number of pics->10
		check("name", `Please enter collaboration's name`).not().isEmpty(),
		auth,
	],
	require("./create")
);

//@route PATCH      collaboration/:id/addColaber
//@description      add other collabers to collaboration
//@access           auth needed + must be a member of collaboration
collaboration.patch(
	"/:id/addColaber",
	[auth, check("email", "Please enter a valid email").isEmail()],
	require("./addColaber")
);

//@route GET        collaboration/:id
//@description      get collaboration data
//@access           auth needed
collaboration.get("/:id", [auth], async (req, res) => {
	try {
		let colab = await Colaboration.findOne({ _id: req.params.id }).populate(
			"members",
			"firstName lastName email _id avatar"
		);
		console.log(colab);
		if (colab == null) {
			return res.status(400).json({ message: "Collaboration not found" });
		}
		res.send(colab);
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Server Error." });
	}
});

//@route PUT    Collaboration/follow
//@description  follow other user
//@access       auth needed
collaboration.put("/follow/:proj_id", auth, require("./follow"));

//@route DELETE     collaboration/:id/removeColaber
//@description      creator can remove collaber, and colaber can leave collaboration
//@access           auth needed
collaboration.delete("/:id/removeColaber", auth, require("./removeColaber"));

//@route DELETE     collaboration/:id
//@description      Delete collaboration
//@access           auth needed + only the creator can delete collaboration
collaboration.delete("/:id", auth, require("./delete"));

//@route PATCH     collaboration/update/:id
//@description     update collaboration
//@access          auth needed + both creator and colabers can edit projects
collaboration.patch(
	"/update/:id",
	[
		upload.array("photos"), //max number of pics->10
		auth,
	],
	require("./update")
);

//@route post    collaboration/:id/message
//@description   send new collaboration group chat message
//@access        auth needed + only members
collaboration.post("/:id/message", auth, require("./sendMessage"));

//@route post    collaboration/:id/messages
//@description  get collaboration's group chat messages
//@access       auth needed + only members
collaboration.get("/:id/messages/:page", auth, require("./getMessages"));

module.exports = collaboration;
