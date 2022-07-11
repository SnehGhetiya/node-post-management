const express = require("express");
const router = express.Router();

const {
	createPost,
	editPost,
	listPosts,
	getPostByUsername,
	deletePost,
} = require("../../controllers/post/post.controller");
const { verifyToken } = require("../../middlewares/auth.middlewares");

router
	.post("/", verifyToken, createPost)
	.put("/:id", verifyToken, editPost)
	.get("/", listPosts)
	.get("/:username", verifyToken, getPostByUsername)
	.delete("/:id", verifyToken, deletePost);

module.exports = router;
