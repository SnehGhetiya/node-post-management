const express = require("express");
const router = express.Router();

const { signUp, login } = require("../../controllers/user/user.controller");

router.post("/signup", signUp).post("/login", login);

module.exports = router;
