const User = require("../../models/user/user.model");
const { isUserExists } = require("../../middlewares/user.middlewares");
const { generateToken } = require("../../middlewares/auth.middlewares");

const signUp = async (req, res) => {
	const newUser = new User({ ...req?.body });

	let validation = newUser.joiValidate({ ...req?.body });

	if (validation.error) {
		return res
			.status(400)
			.json({ status: "failed", message: validation.error.details[0].message });
	}

	const result = await isUserExists(req?.body?.email);

	if (result) {
		return res.status(400).json({
			status: "failed",
			message: "User with this email already exist",
		});
	}

	try {
		await newUser.save();
		const token = generateToken({
			id: newUser._id,
			username: newUser.username,
		});
		res.status(201).json({ status: "success", token });
	} catch (err) {
		res.status(500).json({ status: "failed", message: err.message });
	}
};

const login = async (req, res) => {
	const user = await isUserExists(req?.body?.email);

	if (!user) {
		return res.status(400).json({
			status: "failed",
			message: "User with this email does not exist",
		});
	}

	const result = await user.comparePassword(req?.body?.password);

	if (!result) {
		return res
			.status(400)
			.json({ status: "failed", message: "Password is incorrect" });
	}
	try {
		const token = generateToken({
			id: user._id,
			username: user.username,
		});
		res.status(200).json({ status: "success", token });
	} catch (err) {
		res.status(500).json({ status: "failed", message: err.message });
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await User.find({}, { _id: 0, __v: 0 });
		res.status(200).json({ status: "success", users });
	} catch (err) {
		res.status(500).json({ status: "failed", message: err.message });
	}
};

module.exports = { signUp, login, getUsers };
