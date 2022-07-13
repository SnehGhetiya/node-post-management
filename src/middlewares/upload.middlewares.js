const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;
const FILE_PATH = `${__dirname} + /../../public/uploads`;

let storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, FILE_PATH);
	},
	filename(req, file, callback) {
		callback(
			null,
			Date.now() +
				"-" +
				Math.round(Math.random() * 1e9) +
				"." +
				file.originalname.split(".")[1]
		);
	},
});

let uploadFile = multer({
	storage: storage,
	limits: {
		fileSize: maxSize,
	},
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
