const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
require("dotenv").config({ path: `${__dirname} /../../../.env` });

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.pre("save", function (next) {
	if (this.isModified("password")) {
		bcrypt.hash(
			this.password,
			parseInt(process.env.SALT_FACTOR),
			(err, hash) => {
				if (err) return next(err);

				this.password = hash;
				next();
			}
		);
	}
});

userSchema.methods.comparePassword = async function (password) {
	if (!password) throw new Error("Password is missing");

	try {
		const result = await bcrypt.compare(password, this.password);
		return result;
	} catch (err) {
		console.log(err);
	}
};

userSchema.methods.joiValidate = function ({ username, email, password }) {
	var schema = Joi.object({
		username: Joi.string().min(6).max(10).messages({
			"string.empty": "Username is required",
			"string.min": "Username must be at least 6 characters",
			"string.max": "Username must be at most 10 characters",
		}),
		email: Joi.string()
			.email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
			.required()
			.messages({
				"string.email": "Invalid email address",
				"string.empty": "Email is required",
			}),
		password: Joi.string()
			.pattern(new RegExp(/^[A-Za-z0-9@]{8,10}$/))
			.required()
			.messages({
				"string.pattern.base": "Password is not valid",
				"string.empty": "Password is required",
				"string.min": "Password must be at least 8 characters",
				"string.max": "Password must be at most 10 characters",
			}),
	});
	return schema.validate({ username, email, password });
};

const User = mongoose.model("User", userSchema);

module.exports = User;
