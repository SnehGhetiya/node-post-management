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

const editPost = async (req, res, next) => {
	const post = Post.findOne({ _id: req?.params?.id });

	if (!post) {
		return res.status(404).json({
			status: "failed",
			message: "Post not found",
		});
	}
	try {
		const updatedPost = await Post.findOneAndUpdate(
			{ _id: req?.params?.id },
			{ ...req.body, author: req?.user?.username },
			{ new: true }
		);
		return res.status(200).json({ status: "success", updatedPost });
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

const listPosts = async (req, res, next) => {
	try {
		const posts = await Post.find({});
		return res.status(200).json({ status: "success", posts });
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

const getPostByUsername = async (req, res, next) => {
	const { username } = req.params;
	try {
		const posts = await Post.find({ author: username });
		return res.status(200).json({ status: "success", posts });
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

const deletePost = async (req, res, next) => {
	try {
		const post = await Post.findOneAndDelete({ _id: req?.params?.id });
		return res.status(200).json({ status: "success", post });
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

module.exports = {
	createPost,
	editPost,
	listPosts,
	getPostByUsername,
	deletePost,
};
