const Post = require("../models/post/post.model");

const isPostExists = async (title) => {
	const isPostExist = await Post.findOne({ title });

	if (isPostExist) {
		return isPostExist;
	}

	return false;
};

module.exports = {
	isPostExists,
};
