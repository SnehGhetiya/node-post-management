const User = require("../models/user/user.model");

const isUserExists = async (email) => {
	const isUserExist = await User.findOne({ email });

	if (isUserExist) {
		return isUserExist;
	}

	return false;
};

module.exports = {
	isUserExists,
};
