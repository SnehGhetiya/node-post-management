const express = require("express");
const router = express.Router();

const { upload } = require("../../controllers/file/file.controller");

router.post("/upload", upload);

module.exports = router;
