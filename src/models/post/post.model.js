const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
require("dotenv").config({ path: `${__dirname} /../../../.env` });

const postSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	body: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	tags: {
		type: [String],
		required: true,
	},
});

postSchema.methods.joiValidate = function ({ title, body, author, tags }) {
	var schema = Joi.object({
		title: Joi.string().min(6).max(20).messages({
			"string.empty": "Title is required",
			"string.min": "Title must be at least 6 characters",
			"string.max": "Title must be at most 20 characters",
		}),
		body: Joi.string().min(6).max(200).messages({
			"string.empty": "Body is required",
			"string.min": "Body must be at least 6 characters",
			"string.max": "Body must be at most 200 characters",
		}),
		author: Joi.string().messages({
			"string.empty": "Author is required",
		}),
		tags: Joi.array().items(
			Joi.string()
				.valid("Science", "Technology", "Newsletter")
				.min(1)
				.max(3)
				.messages({
					"string.min": "Minimum 1 tag is required",
					"string.max": "Maximum 3 tags are allowed",
				})
		),
	});
	return schema.validate({ title, body, author, tags });
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
