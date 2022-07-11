const express = require("express");
const router = express.Router();

const {
	signUp,
	login,
	getUsers,
} = require("../../controllers/user/user.controller");
const { verifyToken } = require("../../middlewares/auth.middlewares");

router.post("/signup", signUp);
router.post("/login", login);
router.get("/users", verifyToken, getUsers);

module.exports = router;
