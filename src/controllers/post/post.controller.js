const Post = require("../../models/post/post.model");
const { isPostExists } = require("../../middlewares/post.middlewares");
const {
	getPagination,
	escapeRegex,
} = require("../../middlewares/common.middlewares");

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
	const { page, size, search } = req?.query;

	const { limit, offset } = getPagination(page, size);

	if (search) {
		const regex = new RegExp(escapeRegex(search), "gi");
		try {
			const posts = await Post.find({
				$or: [
					{ title: { $regex: regex } },
					{ body: { $regex: regex } },
					{ tags: { $regex: regex } },
				],
			})
				.limit(limit)
				.skip(offset);
			return res
				.status(200)
				.json({ status: "success", posts, total: posts.length });
		} catch (err) {
			return res.status(500).json({
				status: "failed",
				message: err.message,
			});
		}
	}

	try {
		const posts = await Post.find({}).limit(limit).skip(offset);
		const totalPosts = await Post.count({});
		return res
			.status(200)
			.json({ status: "success", posts, total: totalPosts });
	} catch (err) {
		return res.status(500).json({
			status: "failed",
			message: err.message,
		});
	}
};

const getPostByUsername = async (req, res, next) => {
	const { username } = req.params;

	const { page, size } = req?.query;

	const { limit, offset } = getPagination(page, size);

	if (page && size) {
		try {
			const posts = await Post.find({ author: username })
				.limit(limit)
				.skip(offset);
			return res
				.status(200)
				.json({ status: "success", posts, total: posts.length });
		} catch (err) {
			return res.status(500).json({
				status: "failed",
				message: err.message,
			});
		}
	}

	try {
		const posts = await Post.find({ author: username });
		const totalPosts = await Post.count({ author: username });
		return res
			.status(200)
			.json({ status: "success", posts, total: totalPosts });
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
