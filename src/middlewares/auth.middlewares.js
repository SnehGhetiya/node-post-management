const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname} /../../.env` });

const generateToken = ({ id, username }) => {
	return jwt.sign({ id, username }, process.env.JWT_SECRET, {
		expiresIn: "1h",
	});
};

const verifyToken = (req, res, next) => {
	const token = req?.headers?.authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			status: "failed",
			message: "Unauthorized",
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(500).json({
				status: "failed",
				message: err.message,
			});
		}
		req.user = decoded;
		next();
	});
};

module.exports = {
	generateToken,
	verifyToken,
};
