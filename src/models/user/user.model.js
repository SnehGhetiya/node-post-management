const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
	var user = this;
	var SALT_FACTOR = parseInt(process.env.SALT_FACTOR) || 10;

	if (!user.isNew && !user.isModified("password")) return next();

	console.log(user);

	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err) return next(err);
		console.log(salt);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

const User = mongoose.model("User", userSchema);

module.exports = User;
