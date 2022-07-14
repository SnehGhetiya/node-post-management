const uploadFile = require("../../middlewares/upload.middlewares");

const upload = async (req, res, next) => {
	try {
		await uploadFile(req, res);

		if (req.file === undefined || req.file === null) {
			return res.status(200).json({ message: "Please upload a file" });
		}

		res.status(200).json({
			filePath: "http://localhost:5000/" + `${req?.file?.filename}`,
		});
	} catch (error) {
		if (error.code == "LIMIT_FILE_SIZE") {
			error.message = "File size is too big";
		}
		return res.status(500).json({
			message: error.message,
		});
	}
};

module.exports = {
	upload,
};
