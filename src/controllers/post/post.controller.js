const Post = require("../../models/post/post.model");
const { isPostExists } = require("../../middlewares/post.middlewares");

const createPost = async (req, res) => {
	const newPost = new Post({ ...req.body, author: req?.user?.username });

	let validation = newPost.joiValidate({ ...req.body });

	if (validation.error) {
		return res
			.status(400)
			.json({ status: "failed", message: validation.error.details[0].message });
	}

	const result = await isPostExists(req?.body?.title);

	if (result) {
		return res.status(400).json({
			status: "failed",
			message: "Post already exists",
		});
	}

	try {
		await newPost.save();
		res.status(201).json({ status: "success", newPost });
	} catch (err) {
		res.status(500).json({ status: "failed", message: err.message });
	}
};

module.exports = {
	createPost,
};
