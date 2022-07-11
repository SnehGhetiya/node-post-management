const express = require("express");
const router = express.Router();

const { createPost } = require("../../controllers/post/post.controller");
const { verifyToken } = require("../../middlewares/auth.middlewares");

router.post("/create", verifyToken, createPost);

module.exports = router;
