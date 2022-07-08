const User = require("../../models/user/user.model");

const createUser = async (req, res) => {
	const newUser = new User({ ...req.body });

	// try {
	// 	await newUser.save();
	// 	res.status(201).json({ data: newUser });
	// } catch (err) {
	// 	res.status(500).json({ message: err.message });
	// }
};

module.exports = { createUser };
