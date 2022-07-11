const jwt = require("jsonwebtoken");
require("dotenv").config({ path: `${__dirname} /../../.env` });

const generateToken = (user) => {
	return jwt.sign({ data: user }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (req, res, next) => {
	const token = req?.headers?.authorization.split(" ")[1];
	if (!token) {
		return res.status(401).json({
			message: "Unauthorized",
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			console.log(err);
			return res.status(500).json({
				message: "Failed to authenticate token",
			});
		}
		req.user = decoded.data;
		next();
	});
};

module.exports = {
	generateToken,
	verifyToken,
};